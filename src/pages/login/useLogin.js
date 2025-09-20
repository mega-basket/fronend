import axios from "axios";
import { apiPath } from "../../api/apiPath";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${apiPath.createUser}`,
        formData
      );
      return res.data;
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${apiPath.login}`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Login Successfull");
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      navigate("/");
    },
    onError: () => {
      toast.error("Login Failed");
    },
  });
};
