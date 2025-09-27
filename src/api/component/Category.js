import { useQuery } from "@tanstack/react-query";
import apiService from "../apiService";
import { apiPath } from "../apiPath";

export const useGetCategory = () => {
  return useQuery({
    queryKey: ["getCategory"],
    queryFn: async () => {
      const res = await apiService.get(`${apiPath.getCategory}`);
      return res.data.categories || [];
    },
  });
};
