import { useEffect, useState } from "react";
import { ArrowUp, Headset } from "lucide-react";

function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3">
      {visible && (
        <button
          onClick={scrollToTop}
          className="animate-fadeIn flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-card-hover transition hover:-translate-y-0.5 hover:text-brand-600"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        href="/support"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-card-hover transition hover:-translate-y-0.5 hover:bg-neutral-800"
        aria-label="Support"
      >
        <Headset size={20} />
      </a>
    </div>
  );
}

export default FloatingActions;
