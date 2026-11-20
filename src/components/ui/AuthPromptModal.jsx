import { useLocation, useNavigate } from "react-router-dom";
import { X, LogIn } from "lucide-react";

/**
 * AuthPromptModal
 * ----------------
 * Shown whenever a logged-out visitor tries to do something that requires
 * an account (add to cart, add to wishlist). Offers a quick path to log in
 * or create an account without losing their place on the page.
 */
const AuthPromptModal = ({
  open,
  onClose,
  message = "Log in or create an account to add items to your cart and wishlist.",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  const goTo = (path) => {
    onClose();
    // Remember this page so login/signup can return the user here.
    navigate(path, { state: { from: location } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <X size={16} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
          <LogIn size={20} className="text-neutral-700" />
        </div>

        <h2 id="auth-prompt-title" className="mt-4 text-lg font-semibold text-neutral-900">
          Sign in required
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{message}</p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => goTo("/login")}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => goTo("/signup")}
            className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
