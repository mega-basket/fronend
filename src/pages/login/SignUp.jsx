import React, { useState } from "react";
import Logo from "../../assets/logo";
import { useSignUp } from "./useLogin";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    city: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  const signMutation = useSignUp();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    signMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("You are register Successfully");
        navigate("/login");
      },
      onError: () => {
        toast.error("Registration failed");
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen rounded-lg">
      <div className="bg-white/35 p-4 w-[44vw] rounded-lg">
        <div className="flex items-center mb-3 justify-center border-b-2 border-b-blue-500">
          <Logo />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4 text-black">
            {[
              { name: "name", type: "text", placeholder: "Full Name" },
              { name: "userName", type: "text", placeholder: "Username" },
              { name: "email", type: "email", placeholder: "Email Address" },
              { name: "password", type: "password", placeholder: "Password" },
              { name: "city", type: "text", placeholder: "City" },
              { name: "phone", type: "tel", placeholder: "Phone Number" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={["name", "userName", "email", "password"].includes(
                  field.name
                )}
              />
            ))}

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {signMutation.isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account? <span onClick={""}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
