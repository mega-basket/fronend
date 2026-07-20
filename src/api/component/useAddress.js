import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await apiService.get(apiPath.getAddresses);
      return res.data.addresses || [];
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiService.post(apiPath.createAddress, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressId) => {
      const res = await apiService.delete(`${apiPath.deleteAddress}${addressId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
