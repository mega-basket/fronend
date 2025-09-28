import { useQuery } from "@tanstack/react-query";
import { apiPath } from "../apiPath";
import apiService from "../apiService";

export const GetProductApi = () => {
  return useQuery({
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getProducts}`);
      return res.data.product;
    },
  });
};

export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: ["getProduct", productId], // cache key includes ID
    enabled: !!productId, // only run if ID is truthy
    queryFn: async () => {
      const res = await apiService.get(
        `${apiPath.getProductsById}${productId}`
      );

      return res.data.product;
    },
  });
};

export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: ["productsByCategory", categoryId], // cache by category
    enabled: !!categoryId, // skip until we have an id
    queryFn: async () => {
      const res = await apiService.get(
        `${apiPath.getProducts}?categoryId=${categoryId}`
      );

      return res.data.product || [];
    },
  });
};
