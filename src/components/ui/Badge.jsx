const TONES = {
  neutral: "bg-neutral-100 text-neutral-700",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-600",
  warning: "bg-amber-50 text-amber-700",
  dark: "bg-neutral-900 text-white",
};

const Badge = ({ tone = "neutral", className = "", children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
