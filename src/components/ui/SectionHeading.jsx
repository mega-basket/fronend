import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** "Shop by Category" / "Popular Products" style section header with a "See all" link. */
const SectionHeading = ({ title, subtitle, seeAllTo }) => (
  <div className="flex items-end justify-between gap-3">
    <div>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-neutral-900 md:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
    </div>
    {seeAllTo && (
      <Link
        to={seeAllTo}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        See all
        <ArrowRight size={14} />
      </Link>
    )}
  </div>
);

export default SectionHeading;
