import { formatInr } from "./formatInr";

/**
 * Consistent price display: current price, optional struck-through MRP,
 * and the discount percentage badge — used by product cards, cart, checkout.
 */
const PriceTag = ({ price, compareAtPrice, size = "md", className = "" }) => {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const priceCls = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`font-bold text-neutral-900 ${priceCls}`}>
        {formatInr(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-neutral-400 line-through">
            {formatInr(compareAtPrice)}
          </span>
          <span className="text-sm font-semibold text-emerald-600">
            {discountPct}% off
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
