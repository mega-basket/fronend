import { useNavigate } from "react-router-dom";
import { Gift, Sparkles, Tag } from "lucide-react";
import Button from "../ui/Button";

// Scattered decorative sparkles, positioned like the little hearts in a
// typical retail promo poster — purely visual, no content dependency.
const DECORATIONS = [
  { top: "12%", left: "6%", size: 18, rotate: "-12deg" },
  { top: "72%", left: "12%", size: 14, rotate: "8deg" },
  { top: "22%", left: "92%", size: 16, rotate: "15deg" },
  { top: "80%", left: "88%", size: 20, rotate: "-6deg" },
  { top: "45%", left: "4%", size: 12, rotate: "20deg" },
];

/**
 * Poster-style promo banner — bold discount headline, promo code, CTA, and
 * a decorative badge/illustration. Coded (not a flat image) so the copy
 * stays real text: accessible, linkable, and easy to update per campaign.
 */
const PromoBanner = ({
  discount = "50% OFF",
  title = "On Your First Order",
  code = "WELCOME50",
  ctaTo = "/products?sort=deals",
}) => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-600 to-rose-800 shadow-card">
        {DECORATIONS.map((d, i) => (
          <Sparkles
            key={i}
            size={d.size}
            style={{ top: d.top, left: d.left, transform: `rotate(${d.rotate})` }}
            className="pointer-events-none absolute text-white/25"
          />
        ))}

        <div className="relative flex flex-col items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:justify-between lg:px-16">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              {discount}
            </p>
            <p className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-white/95 sm:text-2xl">
              {title}
            </p>
            {code && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rose-100">
                <Tag size={14} />
                Use code: <span className="font-bold text-white">{code}</span>
              </p>
            )}
            <div className="mt-6">
              <Button variant="white" size="lg" onClick={() => navigate(ctaTo)}>
                Shop Now
              </Button>
            </div>
          </div>

          {/* Illustration + rotated badge, standing in for a product photo */}
          <div className="relative flex h-44 w-44 shrink-0 items-center justify-center sm:h-56 sm:w-56">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20">
              <Gift size={88} strokeWidth={1.25} className="text-white/90" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-20 w-20 -rotate-12 flex-col items-center justify-center rounded-full bg-white text-center shadow-lg sm:h-24 sm:w-24">
              <span className="text-base font-extrabold leading-none text-rose-600 sm:text-lg">
                {discount.replace(/\s*OFF$/i, "")}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-rose-500">
                Off
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
