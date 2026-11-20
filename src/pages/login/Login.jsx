import { Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useLogin } from "./useLogin";
import AuthLayout from "./components/AuthLayout";
import Button from "../../components/ui/Button";
import FieldError from "../../components/ui/FieldError";
import useFormValidation from "../../hooks/useFormValidation";
import { email, required } from "../../utils/validation";

const inputCls =
  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2";
const okCls = "border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10";
const errCls = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15";

const SCHEMA = {
  email: [required("Email is required"), email()],
  password: [required("Password is required")],
};

const Login = () => {
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin(redirectTo);
  const { errors, validateAll, onBlur, revalidate } = useFormValidation(SCHEMA);

  const isLoggedIn = !!localStorage.getItem("user");
  if (isLoggedIn) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => {
    const next = { ...formData, [e.target.name]: e.target.value };
    setFormData(next);
    revalidate(e.target.name, next);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateAll(formData)) return;
    loginMutation.mutate(formData, {
      onError: (err) => toast.error(err.response?.data?.message || "Invalid email or password"),
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={from ? "Please sign in to continue" : "Sign in to continue to your account"}
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => onBlur("email", formData)}
            placeholder="you@example.com"
            className={`${inputCls} ${errors.email ? errCls : okCls}`}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
          <FieldError id="login-email-error" message={errors.email} />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => onBlur("password", formData)}
              placeholder="Enter your password"
              className={`${inputCls} pr-10 ${errors.password ? errCls : okCls}`}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "login-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError id="login-password-error" message={errors.password} />
        </div>

        <Button type="submit" fullWidth size="lg" loading={loginMutation.isPending}>
          {loginMutation.isPending ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
