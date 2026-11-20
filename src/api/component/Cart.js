import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

const CART_KEY = ["addToCart"];

export const useGetToCart = () => {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const res = await apiService.get(apiPath.getCart);
      return res.data.cart;
    },
  });
};

/**
 * Optimistic update helpers: change the cached cart right away, roll back if
 * the request fails, and always re-sync with the server afterwards.
 */
const optimisticCart = (queryClient, applyChange) => ({
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: CART_KEY });
    const previous = queryClient.getQueryData(CART_KEY);
    if (Array.isArray(previous)) {
      queryClient.setQueryData(CART_KEY, applyChange(previous, variables));
    }
    return { previous };
  },
  onError: (_err, _variables, context) => {
    if (context?.previous !== undefined) queryClient.setQueryData(CART_KEY, context.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
});

// Adding needs server data (variant, price) to build a cart line, so it is
// not optimistic — the cart refreshes as soon as the server confirms.
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.addToCart, data);
      return res.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.patch(apiPath.updateCartQuantity, data);
      return res.data;
    },
    ...optimisticCart(queryClient, (cart, { productId, variantId, quantity }) =>
      cart.map((item) =>
        item.product?._id === productId && item.variant?._id === variantId
          ? { ...item, quantity, subtotal: (item.priceAtAdd || 0) * quantity }
          : item
      )
    ),
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.removeFromCart, data);
      return res.data;
    },
    ...optimisticCart(queryClient, (cart, { cartItemId }) =>
      cart.filter((item) => item._id !== cartItemId)
    ),
  });
};
