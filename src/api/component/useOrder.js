import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

// Server-side validation of cart + address; returns items, subtotal,
// shippingCharge and totalAmount computed by the backend.
export const useValidateCheckout = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.validateCheckout, data);
      return res.data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.createOrder, data);
      return res.data;
    },
    onSuccess: () => {
      // Order placement clears the cart on the server
      queryClient.invalidateQueries({ queryKey: ["addToCart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Online payment (Stripe): backend validates cart + address and returns
// { clientSecret, totalAmount } for the Stripe PaymentElement.
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.createPaymentIntent, data);
      return res.data;
    },
  });
};

// After Stripe confirms payment, fetch (or lazily create) the order.
// Retries while the webhook is still processing ("Order not ready yet").
export const fetchOrderByPaymentIntent = async (paymentIntentId, tries = 5) => {
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await apiService.get(
        `${apiPath.orderByPaymentIntent}${paymentIntentId}`
      );
      return res.data;
    } catch (err) {
      if (attempt === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiService.get(apiPath.getOrders);
      return res.data.orders || [];
    },
    // Keep the order card in sync if an admin reviews a cancellation/return
    // while the customer is viewing their orders page.
    refetchInterval: 30_000,
  });
};

const useOrderRequest = (action) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const { data } = await apiService.post(
        `order/${orderId}/${action}`,
        { reason }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useRequestOrderCancellation = () =>
  useOrderRequest("cancel-request");

export const useRequestOrderReturn = () =>
  useOrderRequest("return-request");
