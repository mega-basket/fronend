import React, { useState, useMemo } from "react";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../../api/component/useWishlist";
import { useIsLoggedIn } from "../../../hooks/useAuth";
import AuthPromptModal from "../../../components/ui/AuthPromptModal";
import { imgProps } from "../../../utils/image";

/**
 * ProductsCard
 * ------------
 * Production-grade product card.
 * - Wishlist state is derived from `items._id` (this card's product), not the URL.
 * - Single source of truth for favorite state (server via useGetWishlist).
 * - Buttons disable while mutations are in-flight.
 * - Quick-view + wishlist float in on hover for desktop, and are always
 *   visible on touch devices (no hover on mobile).
 */
const ProductsCard = ({ items, onQuickView }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const addWishlist = useWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const { data: wishlist = [] } = useGetWishlist();

  const isWishlisted = useMemo(
    () => wishlist.some((w) => w._id === items?._id),
    [wishlist, items?._id]
  );

  const isMutating = addWishlist.isPending || removeWishlist.isPending;

  const discountPct = useMemo(() => {
    if (!items?.price || !items?.discountPrice) return 0;
    return Math.round(((items.price - items.discountPrice) / items.price) * 100);
  }, [items?.price, items?.discountPrice]);

  const rating = items?.rating ?? 4.8;
  const ratingCount = items?.ratingCount;
  const thumbnail = items?.variants?.[0]?.thumbnail || "/api/placeholder/600/600";

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return setAuthModalOpen(true);
    if (!items?._id || isMutating) return;

    if (isWishlisted) {
      removeWishlist.mutate(
        { productId: items._id },
        {
          onSuccess: () => toast.success("Removed from wishlist"),
          onError: () => toast.error("Couldn't update wishlist"),
        }
      );
    } else {
      addWishlist.mutate(
        { productId: items._id, product: items },
        {
          onSuccess: () => toast.success("Added to wishlist"),
          onError: () => toast.error("Couldn't update wishlist"),
        }
      );
    }
  };

  const goToProduct = () => navigate(`/products/${items.slug}`);

  return (
    <article
      className="group relative flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] focus-within:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
      aria-label={items?.productName}
    >
      {/* Media */}
      <button
        type="button"
        onClick={goToProduct}
        className="relative block aspect-square w-full overflow-hidden bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        aria-label={`View ${items?.productName}`}
      >
        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-neutral-100" />
        )}

        <img
          {...imgProps(thumbnail, 400)}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          alt={items?.productName || "Product image"}
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Discount badge */}
        {discountPct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
            {discountPct}% OFF
          </span>
        )}

        {/* Floating actions – visible on hover (desktop) & always on touch */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <IconButton
            label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistToggle}
            disabled={isMutating}
            active={isWishlisted}
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-current" : ""}
              strokeWidth={2}
            />
          </IconButton>

          {onQuickView && (
            <IconButton
              label="Quick view"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(items);
              }}
            >
              <Eye size={16} strokeWidth={2} />
            </IconButton>
          )}
        </div>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-200 text-neutral-200"
                }
              />
            ))}
          </div>
          <span className="tabular-nums">
            {rating.toFixed(1)}
            {ratingCount ? ` (${ratingCount.toLocaleString()})` : ""}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-medium leading-snug text-neutral-900"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={items?.productName}
        >
          {items?.productName}
        </h3>

        {/* Price */}
        {items?.price != null && (
          <div className="flex items-baseline gap-2">
            {items.discountPrice ? (
              <>
                <span className="text-lg font-semibold tracking-tight text-neutral-900 tabular-nums">
                  ₹{items.discountPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-neutral-400 line-through tabular-nums">
                  ₹{items.price.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold tracking-tight text-neutral-900 tabular-nums">
                ₹{items.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={goToProduct}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:bg-neutral-950"
          >
            <ShoppingBag size={16} strokeWidth={2.2} />
            Buy now
          </button>

          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isMutating}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-60 ${
              isWishlisted
                ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={isWishlisted ? "fill-current" : ""}
            />
          </button>
        </div>
      </div>

      <AuthPromptModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </article>
  );
};

/** Small round icon button used inside the media area. */
const IconButton = ({ children, label, onClick, disabled, active }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-60 ${
      active
        ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
        : "border-neutral-200 bg-white/90 text-neutral-700 hover:bg-white"
    }`}
  >
    {children}
  </button>
);

export default ProductsCard;