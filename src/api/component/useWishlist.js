import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.addToWishlist, data);
      console.log("wishlist res:", res);

      return res;
    },
    onSuccess: () => {
      // 🔑 force a refetch of the wishlist
      queryClient.invalidateQueries(["getWishlist"]);
    },
  });
};

export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["getWishlist"],
    queryFn: async () => {
      const res = await apiService.get(apiPath.getWishlist);
      return res.data.wishList;
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiService.delete(apiPath.removeWishlist, {
        data: { productId: payload.productId },
      });
      return res;
    },
    onSuccess: () => {
      // 🔑 force a refetch of the wishlist
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
};
