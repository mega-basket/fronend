import { useId } from "react";

// Decorative right-hand artwork for a hero slide: colour glows, a dotted
// grid, rings, a frosted "hero card" with the category icon, and smaller
// icon tiles floating around it. Purely visual (aria-hidden).

// Where each satellite tile sits, as % of the artwork area.
const SATELLITE_SPOTS = [
  { top: "14%", left: "18%", rotate: "-8deg", size: "lg" },
  { top: "12%", left: "78%", rotate: "6deg", size: "md" },
  { top: "68%", left: "84%", rotate: "-4deg", size: "lg" },
  { top: "74%", left: "22%", rotate: "8deg", size: "md" },
  { top: "42%", left: "6%", rotate: "4deg", size: "sm" },
  { top: "44%", left: "94%", rotate: "-6deg", size: "sm" },
];

const TILE_SIZE = {
  sm: { box: "h-12 w-12 rounded-xl lg:h-14 lg:w-14", icon: 20 },
  md: { box: "h-14 w-14 rounded-2xl lg:h-16 lg:w-16", icon: 24 },
  lg: { box: "h-16 w-16 rounded-2xl lg:h-20 lg:w-20", icon: 30 },
};

const DOT_MASK = "radial-gradient(ellipse at 60% 50%, black 30%, transparent 75%)";

export const BannerGlows = ({ theme }) => (
  <>
    <div className={`absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl ${theme.glowA}`} />
    <div className={`absolute -bottom-32 right-1/3 h-80 w-80 rounded-full blur-3xl ${theme.glowB}`} />
  </>
);

const BannerArt = ({ theme, active }) => {
  const MainIcon = theme.icon;
  const TagIcon = theme.tagIcon || theme.icon;
  // useId() contains characters (":" or "«»") that break url(#id) references.
  const patternId = `hero-dots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] md:block">
      {/* Dotted grid, fading out towards the edges */}
      <svg
        className="absolute inset-0 h-full w-full text-white/15"
        style={{ maskImage: DOT_MASK, WebkitMaskImage: DOT_MASK }}
      >
        <defs>
          <pattern id={patternId} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div className="absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Rings */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 lg:h-[480px] lg:w-[480px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 lg:h-[340px] lg:w-[340px]" />

        {/* Hero card */}
        <div
          className={`relative flex h-52 w-52 flex-col items-center justify-center rounded-[2.5rem] bg-white/10 shadow-2xl ring-1 ring-inset ring-white/25 backdrop-blur-md transition-transform duration-700 ease-out lg:h-60 lg:w-60 ${
            active ? "scale-100" : "scale-90"
          }`}
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
          <MainIcon size={104} strokeWidth={1.25} className="relative text-white drop-shadow-lg" />
          <span className="absolute -bottom-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-lg">
            <TagIcon size={14} />
            {theme.tag}
          </span>
        </div>
      </div>

      {/* Floating satellites */}
      {theme.satellites.slice(0, SATELLITE_SPOTS.length).map((Icon, i) => {
        const spot = SATELLITE_SPOTS[i];
        const size = TILE_SIZE[spot.size];
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: spot.top, left: spot.left, rotate: spot.rotate }}
          >
            <div
              className={`flex items-center justify-center bg-white/15 shadow-xl ring-1 ring-inset ring-white/25 backdrop-blur-md motion-safe:animate-float ${size.box}`}
              style={{ animationDelay: `${i * -1.1}s` }}
            >
              <Icon size={size.icon} strokeWidth={1.75} className="text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannerArt;
