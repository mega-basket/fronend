import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiPath } from "../apiPath";
import apiService from "../apiService";

export const GetProductApi = () => {
  return useQuery({
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getProducts}`);
      return res.data.products;
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

      return res.data.products || [];
    },
  });
};

export const usePopularProducts = () => {
  return useQuery({
    queryKey: ["popularProducts"],
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getPopularProducts}`);
      return res.data.products || [];
    },
  });
};

/**
 * Paginated product listing — matches what backend's GET /products actually
 * supports today: `search`, `categoryId`, `page`, `limit`. (No brand/price/
 * rating/discount/inStock filtering or sorting exists server-side yet.)
 */
export const useCategoryProducts = ({
  categoryId,
  q,
  page = 1,
  limit = 24,
} = {}) => {
  return useQuery({
    queryKey: ["categoryProducts", { categoryId, q, page, limit }],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.set("categoryId", categoryId);
      if (q) params.set("search", q);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await apiService.get(
        `${apiPath.getProducts}?${params.toString()}`
      );

      return {
        products: res.data.products || [],
        total: res.data.totalProducts || 0,
        totalPages: res.data.totalPages || 1,
      };
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
      return res.data.products || [];
    },
  });
};
