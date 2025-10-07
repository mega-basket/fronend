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

export const useGetProductById = (slug) => {
  return useQuery({
    queryKey: ["getProduct", slug], // cache key includes ID
    enabled: !!slug, // only run if ID is truthy
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getProductsById}${slug}`);

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

export const usePopularProducts = () => {
  return useQuery({
    queryKey: ["popularProducts"],
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getPopularProducts}`);
      return res.data.data || [];
    },
  });
};

export const useSearchProducts = (query) => {
  return useQuery({
    queryKey: ["searchProducts", query],
    enabled: !!query, // only run if query is not empty
    queryFn: async () => {
      const res = await apiService.get(
        `${apiPath.getProducts}?search=${query}`
      );
      return res.data.product || [];
    },
  });
};
