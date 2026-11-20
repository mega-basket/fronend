import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import BannerArt, { BannerGlows } from "./BannerArt";
import { BRAND_BANNER, bannerForCategory } from "./heroBanners";

const CATEGORY_CHIPS = ["Fashion", "Electronics", "Grocery", "Beauty", "Shoes", "Books"];
const AUTOPLAY_MS = 5000;
const MAX_CATEGORY_SLIDES = 6;

// Every slide is a coded banner (gradient + artwork), not an uploaded photo,
// so it stays crisp at any screen size and looks consistent whatever images
// admins upload for categories.

function Hero({ categories = [] }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  // Slide 1 is the brand banner; the rest are built from real categories so
  // the carousel always reflects what's actually in the catalog.
  const slides = useMemo(() => {
    const brandSlide = {
      kind: "brand",
      theme: BRAND_BANNER,
      eyebrow: "New season deals are live",
      title: "Your one-stop shop for everything",
      subtitle:
        "Fashion, grocery, electronics, beauty and more — discover deals across every category with one universal search.",
      ctaLabel: "Start exploring",
      ctaTo: "/products",
    };

    const categorySlides = categories.slice(0, MAX_CATEGORY_SLIDES).map((cat) => {
      const theme = bannerForCategory(cat.categoryName);
      return {
        kind: "category",
        theme,
        eyebrow: theme.eyebrow,
        title: cat.categoryName,
        subtitle: theme.subtitle || `Shop the latest in ${cat.categoryName}`,
        ctaLabel: `Shop ${cat.categoryName}`,
        ctaTo: `/products?categoryId=${cat._id}`,
      };
    });

    return [brandSlide, ...categorySlides];
  }, [categories]);

  const count = slides.length;
  const goTo = (i) => setIndex((i + count) % count);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  // Autoplay — pauses on hover/focus so the banner doesn't move under a user
  // who's reading it. Also stop for keyboard users and respect reduced motion.
  useEffect(() => {
    if (count <= 1 || hovered || focused || manuallyPaused || reducedMotion) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [count, hovered, focused, manuallyPaused, reducedMotion]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 48) (distance < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative"
      aria-label="Featured offers"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Full-bleed carousel */}
      <div
        className="relative h-[410px] w-full overflow-hidden bg-neutral-900 sm:h-[440px] lg:h-[500px]"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
      >
        {slides.map((s, i) => (
          <div
            key={`${s.kind}-${s.title}`}
            aria-hidden={i !== index}
            inert={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.title}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* Coded banner background */}
            <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${s.theme.gradient}`}>
              <BannerGlows theme={s.theme} />
              <BannerArt theme={s.theme} active={i === index} />
              {/* Darken the text side so copy stays readable on every theme */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
            </div>

            <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-14 sm:px-6 sm:pb-16 lg:items-center lg:pb-0">
              <div className="max-w-xl">
                {/* Small icon tile on phones, where the artwork is hidden */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20 backdrop-blur md:hidden">
                  <s.theme.icon size={26} className="text-white" strokeWidth={1.75} />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-white/15 backdrop-blur ${s.theme.accent}`}
                >
                  {s.kind === "brand" ? <Sparkles size={14} /> : <s.theme.icon size={14} />}
                  {s.eyebrow}
                </span>
                <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {s.title}
                </h1>
                <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg">
                  {s.subtitle}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" variant="brand" onClick={() => navigate(s.ctaTo)}>
                    {s.ctaLabel}
                    <ArrowRight size={18} />
                  </Button>
                  {s.kind === "brand" && (
                    <Button
                      size="lg"
                      variant="outlineLight"
                      onClick={() => navigate("/products?sort=deals")}
                    >
                      View deals
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:flex"
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => setManuallyPaused((value) => !value)}
              aria-label={manuallyPaused ? "Resume automatic slides" : "Pause automatic slides"}
              aria-pressed={manuallyPaused}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {manuallyPaused ? <Play size={17} /> : <Pause size={17} />}
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-6">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick category shelf — links to real catalog categories when available */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 -mt-8 flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:-mt-9 sm:gap-3 sm:p-5">
          {(categories.length
            ? categories.slice(0, MAX_CATEGORY_SLIDES).map((category) => ({
                label: category.categoryName,
                to: `/products?categoryId=${category._id}`,
              }))
            : CATEGORY_CHIPS.map((label) => ({ label, to: `/products?search=${encodeURIComponent(label)}` }))
          ).map(({ label, to }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(to)}
              className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
