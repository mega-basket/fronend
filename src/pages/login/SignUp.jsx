import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useSignUp } from "./useLogin";
import AuthLayout from "./components/AuthLayout";
import Button from "../../components/ui/Button";
import FieldError from "../../components/ui/FieldError";
import useFormValidation from "../../hooks/useFormValidation";
import { email, maxLength, minLength, pattern, phone, required } from "../../utils/validation";

const inputCls =
  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2";
const okCls = "border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10";
const errCls = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15";

const FIELDS = [
  { name: "name", type: "text", label: "Full Name", required: true, autoComplete: "name", placeholder: "Jane Doe" },
  { name: "userName", type: "text", label: "Username", required: true, autoComplete: "username", placeholder: "janedoe" },
  { name: "email", type: "email", label: "Email Address", required: true, autoComplete: "email", placeholder: "you@example.com" },
  { name: "password", type: "password", label: "Password", required: true, autoComplete: "new-password", placeholder: "At least 8 characters" },
  { name: "phone", type: "tel", label: "Phone Number", required: true, autoComplete: "tel", placeholder: "98765 43210" },
  { name: "city", type: "text", label: "City", autoComplete: "address-level2", placeholder: "City" },
];

const SCHEMA = {
  name: [required("Full name is required"), minLength(2, "Name must be at least 2 characters"), maxLength(60)],
  userName: [
    required("Username is required"),
    minLength(3, "Username must be at least 3 characters"),
    maxLength(30),
    pattern(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, dots and underscores"),
  ],
  email: [required("Email is required"), email()],
  password: [
    required("Password is required"),
    minLength(8, "Password must be at least 8 characters"),
    pattern(/(?=.*[A-Za-z])(?=.*\d)/, "Use at least one letter and one number"),
  ],
  phone: [required("Phone number is required"), phone()],
  city: [maxLength(50)],
  address: [maxLength(200)],
};

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
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const signMutation = useSignUp();
  const { errors, validateAll, onBlur, revalidate } = useFormValidation(SCHEMA);

  const handleChange = (e) => {
    const next = { ...formData, [e.target.name]: e.target.value };
    setFormData(next);
    revalidate(e.target.name, next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll(formData)) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    signMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Registered successfully — please log in");
        // Keep the "came from" page so login can send them back there.
        navigate("/login", { state: location.state });
      },
      onError: (err) => toast.error(err.response?.data?.message || "Registration failed"),
    });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MegaBasket and start saving today"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const id = `signup-${field.name}`;
            const error = errors[field.name];
            const isPassword = field.type === "password";
            return (
              <div key={field.name}>
                <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    id={id}
                    type={isPassword && showPassword ? "text" : field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onBlur={() => onBlur(field.name, formData)}
                    autoComplete={field.autoComplete}
                    className={`${inputCls} ${isPassword ? "pr-10" : ""} ${error ? errCls : okCls}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                <FieldError id={`${id}-error`} message={error} />
              </div>
            );
          })}
        </div>

        <div>
          <label htmlFor="signup-address" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Address
          </label>
          <textarea
            id="signup-address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            onBlur={() => onBlur("address", formData)}
            rows={2}
            autoComplete="street-address"
            className={`${inputCls} resize-none ${errors.address ? errCls : okCls}`}
            aria-invalid={!!errors.address}
          />
          <FieldError message={errors.address} />
        </div>

        <Button type="submit" fullWidth size="lg" loading={signMutation.isPending}>
          {signMutation.isPending ? "Signing up…" : "Sign up"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
