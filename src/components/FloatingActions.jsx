import React from "react";

function FloatingActions() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end gap-3">
      <button
        onClick={scrollToTop}
        className="glass soft-shadow rounded-full p-3 hover:-translate-y-0.5 transition"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4 4 12h5v8h6v-8h5L12 4Z" />
        </svg>
      </button>
      <a
        href="/support"
        className="glass soft-shadow rounded-full p-3 hover:-translate-y-0.5 transition"
        aria-label="Support"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h2v-8H6a6 6 0 0 1 12 0h-2v8h2a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Z" />
        </svg>
      </a>
    </div>
  );
}

export default FloatingActions;
