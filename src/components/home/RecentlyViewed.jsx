import { Link } from "react-router-dom";
import useRecentlyViewed, { clearRecentlyViewed } from "../../hooks/useRecentlyViewed";
import SectionHeading from "../ui/SectionHeading";
import PriceTag from "../ui/PriceTag";
import { imgProps } from "../../utils/image";

/**
 * Horizontal strip of products this visitor opened recently (stored in the
 * browser). Hidden when there's nothing to show.
 *   excludeId – leave out a product (e.g. the one currently being viewed)
 */
const RecentlyViewed = ({ excludeId, title = "Recently Viewed", className = "px-4 py-8 md:py-12" }) => {
  const recent = useRecentlyViewed();
  const items = recent.filter((p) => p._id !== excludeId);

  if (items.length === 0) return null;

  return (
    <section className={className} aria-label={title}>
      <div className="flex items-end justify-between gap-3">
        <SectionHeading title={title} subtitle="Pick up where you left off" />
        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="shrink-0 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p.slug}`}
            className="group w-[160px] flex-none overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-card transition hover:shadow-card-hover sm:w-[180px]"
          >
            <div className="aspect-square overflow-hidden bg-neutral-50">
              {p.thumbnail && (
                <img
                  {...imgProps(p.thumbnail, 180)}
                  alt={p.productName}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-3">
              {p.brand && <p className="truncate text-[11px] uppercase tracking-wider text-neutral-400">{p.brand}</p>}
              <p className="line-clamp-2 text-sm font-medium text-neutral-800 group-hover:text-brand-600">
                {p.productName}
              </p>
              <PriceTag
                price={p.discountPrice || p.price}
                compareAtPrice={p.discountPrice ? p.price : undefined}
                size="sm"
                className="mt-1"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
