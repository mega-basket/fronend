import { Navigate, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo";
import { useLogin } from "./useLogin";
import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email:"",
    password:""
  })
  const loginMutation = useLogin()
  
  const isLoggedIn = !!localStorage.getItem("user");
  if (isLoggedIn) {
    return <Navigate to="/" replace />; // redirect to home
  }
  
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      return toast.error("All fields are required")
    }
    loginMutation.mutate(formData)
  }

  return (
    <div className="flex justify-center items-center h-screen">
    <div className=" bg-white/35 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
    

      <div className="flex items-center justify-center border-b pb-4 mb-4">
        <Logo />
      </div>

      <h3 className="text-xl font-bold text-black mb-4">Welcome Back 👋</h3>

      <div className="space-y-3 text-black">
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleLogin}
          className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </div>
      <p className="mt-2 text-sm text-black">
        Don't have an account?{" "}
        <span
          className="text-blue-500 hover:border-b-2 hover:border-b-blue-500 cursor-pointer font-bold"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign Up
        </span>
      </p>
    </div>
    </div>
  );
};

export default Login;
