import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

export const useGetToCart = () => {
  return useQuery({
    queryKey: ["addToCart"],
    queryFn: async () => {
      const res = await apiService.get(apiPath.getCart);
      console.log("res data", res);
      return res.data.cart;
    },
  });
};

export const useAddToCart = () => {
  const queryCLient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.addToCart, data);
      return res.data;
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["addToCart"] });
    },
  });
};
