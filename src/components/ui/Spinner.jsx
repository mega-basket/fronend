import { Loader2 } from "lucide-react";

export const Spinner = ({ size = 20, className = "" }) => (
  <Loader2 size={size} className={`animate-spin text-neutral-400 ${className}`} />
);

/** Full-section loading placeholder for pages waiting on a query. */
export const PageLoader = ({ label = "Loading…" }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-neutral-500">
    <Spinner size={28} />
    <p className="text-sm">{label}</p>
  </div>
);

/** Inline error placeholder with an optional retry action. */
export const PageError = ({ label = "Something went wrong.", onRetry }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center">
    <p className="text-sm font-medium text-rose-600">{label}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm font-semibold text-brand-600 hover:underline"
      >
        Try again
      </button>
    )}
  </div>
);

export default Spinner;
