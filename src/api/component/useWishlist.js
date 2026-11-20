import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

const WISHLIST_KEY = ["getWishlist"];

/**
 * Optimistic update helpers: the heart fills/empties instantly, rolls back
 * if the request fails, and re-syncs with the server afterwards.
 */
const optimisticWishlist = (queryClient, applyChange) => ({
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
    const previous = queryClient.getQueryData(WISHLIST_KEY);
    queryClient.setQueryData(WISHLIST_KEY, (list) => applyChange(Array.isArray(list) ? list : [], variables));
    return { previous };
  },
  onError: (_err, _variables, context) => {
    queryClient.setQueryData(WISHLIST_KEY, context?.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
});

/**
 * Add to wishlist. Pass `product` (the full product object) alongside
 * `productId` so it can appear in the wishlist immediately; only
 * `productId` is sent to the server.
 */
export const useWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }) => {
      const res = await apiService.post(apiPath.addToWishlist, { productId });
      return res;
    },
    ...optimisticWishlist(queryClient, (list, { productId, product }) =>
      list.some((p) => p._id === productId) ? list : [...list, product || { _id: productId }]
    ),
  });
};

export const useGetWishlist = () => {
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => {
      const res = await apiService.get(apiPath.getWishlist);
      return res.data.wishList;
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }) => {
      const res = await apiService.delete(apiPath.removeWishlist, {
        data: { productId },
      });
      return res;
    },
    ...optimisticWishlist(queryClient, (list, { productId }) => list.filter((p) => p._id !== productId)),
  });
};
