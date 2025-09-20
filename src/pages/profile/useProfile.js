import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiPath } from "../../api/apiPath";

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const token = localStorage.getItem("token"); // Assuming you saved JWT token
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${apiPath.userById}${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.user;
    },
    enabled: !!userId, // only run if userId exists
  });
};
