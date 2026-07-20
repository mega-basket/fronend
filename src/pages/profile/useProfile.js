import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../../api/apiService";
import { apiPath } from "../../api/apiPath";

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.userById}${userId}`);
      return res.data.user;
    },
    enabled: !!userId, // only run if userId exists
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, ...data }) => {
      const res = await apiService.put(`${apiPath.editUser}${userId}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variables.userId],
      });
    },
  });
};
