import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900 disabled:bg-neutral-300",
  brand:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 disabled:bg-brand-300",
  outline:
    "border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus-visible:ring-neutral-900 disabled:text-neutral-400",
  // For use on dark/photo backgrounds (e.g. the hero) where `outline` would be invisible.
  outlineLight:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white disabled:text-white/40",
  // Solid white — for CTAs sitting on a colored/photo banner.
  white:
    "bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white disabled:bg-white/60",
  ghost:
    "text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-900 disabled:text-neutral-400",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 disabled:bg-rose-300",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * Shared button primitive. Keeps variant/size choices consistent across
 * every module instead of ad-hoc bg-blue-600 / bg-orange-500 / bg-pink-600 etc.
 */
const Button = forwardRef(
  (
    {
      as,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || "button";
    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
