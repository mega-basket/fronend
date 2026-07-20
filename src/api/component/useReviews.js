import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

/**
 * Review hooks — match Review.routes.js:
 *   GET    /review/:productId
 *   POST   /review/create           { productId, rating, comment }
 *   PUT    /review/update           { reviewId, rating, comment }
 *   DELETE /review/delete/:reviewId
 */

export const useGetProductReviews = (productId) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data } = await apiService.get(`${apiPath.getReviews}${productId}`);
      return data;
    },
    enabled: !!productId,
  });

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiService.post(apiPath.createReview, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      qc.invalidateQueries({ queryKey: ["getProduct"] });
    },
  });
};

export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiService.put(apiPath.updateReview, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      qc.invalidateQueries({ queryKey: ["getProduct"] });
    },
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId }) => {
      const { data } = await apiService.delete(
        `${apiPath.deleteReview}${reviewId}`
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      if (variables.productId) {
        qc.invalidateQueries({ queryKey: ["reviews", variables.productId] });
        qc.invalidateQueries({ queryKey: ["getProduct"] });
      }
    },
  });
};
