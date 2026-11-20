import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  MapPin,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import { useGetProductById } from "../../../api/component/productApi";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../../api/component/useWishlist";
import {
  useGetToCart,
  useAddToCart,
  useRemoveFromCart,
} from "../../../api/component/Cart";
import { useIsLoggedIn } from "../../../hooks/useAuth";
import AuthPromptModal from "../../../components/ui/AuthPromptModal";
import ReviewsSection from "./ReviewsSection";
import { imgProps } from "../../../utils/image";
import { addRecentlyViewed } from "../../../hooks/useRecentlyViewed";
import RecentlyViewed from "../../../components/home/RecentlyViewed";

/**
 * ProductDetails
 * --------------
 * - Single accent language (neutral-900 primary, amber stars, rose wishlist,
 *   emerald for positive stock/save states).
 * - Sticky mobile action bar so the CTA is always reachable.
 * - Tabbed content area (Description / Specifications / Reviews).
 * - Pincode delivery check (client-side stub — wire to your serviceability API).
 */
const ProductDetails = () => {
  const { slug } = useParams();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.user?.id;
  const isLoggedIn = useIsLoggedIn();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null); // { ok, message }
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { data: product, isLoading, error } = useGetProductById(slug);

  const selectedVariant = product?.variants?.[selectedVariantIdx];

  const addWishlist = useWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const { data: wishlist = [] } = useGetWishlist();

  const { data: cartData = [] } = useGetToCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const isWishlisted = useMemo(
    () => (product ? wishlist.some((w) => w._id === product._id) : false),
    [wishlist, product]
  );

  const cartItem = useMemo(() => {
    if (!product || !selectedVariant) return null;
    return cartData.find(
      (c) =>
        c.product?._id === product._id && c.variant?._id === selectedVariant._id
    );
  }, [cartData, product, selectedVariant]);
  const isInCart = !!cartItem;

  // Remember this product for the "Recently viewed" strip.
  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product]);

  useEffect(() => {
    if (selectedVariant?.thumbnail) setMainImage(selectedVariant.thumbnail);
    setQuantity(1);
  }, [selectedVariant]);

  /* -------------------------------- Handlers ------------------------------ */

  const handleWishlistToggle = () => {
    if (!isLoggedIn) return setAuthModalOpen(true);
    if (!product) return;
    const mutation = isWishlisted ? removeWishlist : addWishlist;
    mutation.mutate(
      { productId: product._id, product },
      {
        onSuccess: () =>
          toast.success(
            isWishlisted ? "Removed from wishlist" : "Added to wishlist"
          ),
        onError: () => toast.error("Couldn't update wishlist"),
      }
    );
  };

  const handleCartToggle = () => {
    if (!isLoggedIn) return setAuthModalOpen(true);
    if (!product) return;
    if (!selectedVariant) return toast.error("Please select a color");

    if (isInCart) {
      removeFromCart.mutate(
        { cartItemId: cartItem._id },
        { onSuccess: () => toast.success("Removed from cart") }
      );
    } else {
      addToCart.mutate(
        {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity,
        },
        {
          onSuccess: () => toast.success("Added to cart"),
          onError: (err) =>
            toast.error(err?.response?.data?.message || "Couldn't add to cart"),
        }
      );
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.productName, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({ ok: false, message: "Enter a valid 6-digit pincode" });
      return;
    }
    // TODO: replace with real serviceability API
    const eta = 3 + (parseInt(pincode.slice(0, 2), 10) % 4);
    setPincodeStatus({
      ok: true,
      message: `Delivery in ${eta}–${eta + 2} days`,
    });
  };

  /* -------------------------------- Render ------------------------------- */

  if (isLoading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="text-lg font-medium text-neutral-900">Product not found</p>
        <p className="mt-2 text-sm text-neutral-500">
          The item you're looking for may have been removed or is unavailable.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const allImages = selectedVariant
    ? [selectedVariant.thumbnail, ...(selectedVariant.images || [])].filter(Boolean)
    : [];

  const stock = selectedVariant?.stockQuantity ?? 0;
  const outOfStock = !selectedVariant || stock === 0;
  const lowStock = !outOfStock && stock <= 5;

  const price = product.price ?? 0;
  const discountPrice = product.discountPrice;
  const effectivePrice = discountPrice || price;
  const savings = discountPrice ? price - discountPrice : 0;
  const discountPct = savings > 0 ? Math.round((savings / price) * 100) : 0;

  const rating = product.avgRating ?? 0;
  const reviewCount = product.totalReviews ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-neutral-900">
          Home
        </Link>
        <ChevronRight size={14} className="text-neutral-300" />
        {product.categoryId?.categoryName && (
          <>
            <Link
              to={`/products?categoryId=${product.categoryId._id}`}
              className="hover:text-neutral-900"
            >
              {product.categoryId.categoryName}
            </Link>
            <ChevronRight size={14} className="text-neutral-300" />
          </>
        )}
        <span className="max-w-[240px] truncate text-neutral-900">
          {product.productName}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ------------------------------ Gallery ---------------------------- */}
        <section aria-label="Product images">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <img
              {...imgProps(mainImage, 640, { priority: true })}
              sizes="(min-width: 1024px) 560px, 100vw"
              alt={product.productName}
              className="aspect-square w-full object-cover"
            />

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discountPct > 0 && (
                <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
                  {discountPct}% OFF
                </span>
              )}
              {outOfStock && (
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm">
                  Out of stock
                </span>
              )}
            </div>

            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <IconChip
                label={isWishlisted ? "Remove from wishlist" : "Save"}
                onClick={handleWishlistToggle}
                active={isWishlisted}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-current" : ""}
                />
              </IconChip>
              <IconChip label="Share" onClick={handleShare}>
                <Share2 size={16} />
              </IconChip>
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => {
                const selected = mainImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 overflow-hidden rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                      selected
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                    aria-current={selected}
                  >
                    <img
                      {...imgProps(img, 80)}
                      alt=""
                      className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ------------------------------ Info ------------------------------- */}
        <section className="flex flex-col gap-5">
          <div>
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {product.brand}
              </p>
            )}
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {product.productName}
            </h1>

            {/* Rating summary */}
            <div className="mt-3 flex items-center gap-3">
              {reviewCount > 0 ? (
                <>
                  <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-sm font-semibold text-emerald-700">
                    <span className="tabular-nums">{rating.toFixed(1)}</span>
                    <Star size={13} className="fill-emerald-700" />
                  </div>
                  <a
                    href="#reviews"
                    className="text-sm text-neutral-500 hover:text-neutral-900"
                  >
                    {reviewCount.toLocaleString("en-IN")} review
                    {reviewCount === 1 ? "" : "s"}
                  </a>
                </>
              ) : (
                <span className="text-sm text-neutral-500">No reviews yet</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight text-neutral-900 tabular-nums">
                ₹{effectivePrice.toLocaleString("en-IN")}
              </span>
              {discountPct > 0 && (
                <>
                  <span className="text-lg text-neutral-400 line-through tabular-nums">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 tabular-nums">
                    Save ₹{savings.toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-neutral-500">Inclusive of all taxes</p>
          </div>

          {/* Variant selector */}
          {product.variants?.length > 0 && (
            <div>
              <p className="text-sm text-neutral-700">
                Color:{" "}
                <span className="font-medium text-neutral-900">
                  {selectedVariant?.color?.name || "—"}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                {product.variants.map((v, idx) => {
                  const selected = idx === selectedVariantIdx;
                  // Prefer hex from the data; fall back to a neutral chip
                  const swatch =
                    v.color?.hex || v.color?.hexCode || "#e5e5e5";
                  return (
                    <button
                      key={v._id || idx}
                      type="button"
                      title={v.color?.name}
                      aria-label={v.color?.name}
                      aria-pressed={selected}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`relative h-9 w-9 rounded-full border transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                        selected
                          ? "border-neutral-900"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <span
                        className="absolute inset-1 rounded-full"
                        style={{ backgroundColor: swatch }}
                      />
                    </button>
                  );
                })}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  outOfStock
                    ? "text-rose-600"
                    : lowStock
                    ? "text-amber-600"
                    : "text-emerald-700"
                }`}
              >
                {outOfStock
                  ? "Out of stock"
                  : lowStock
                  ? `Only ${stock} left — order soon`
                  : "In stock"}
              </p>
            </div>
          )}

          {/* Quantity */}
          {!outOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-700">Quantity</span>
              <div className="inline-flex items-center rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-neutral-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  className="p-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons (desktop) */}
          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              disabled={outOfStock}
              className="flex-1 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={handleCartToggle}
              disabled={outOfStock && !isInCart}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors disabled:opacity-40 ${
                isInCart
                  ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <ShoppingBag size={16} />
              {isInCart ? "Remove from cart" : "Add to cart"}
            </button>
          </div>

          {/* Pincode / delivery */}
          <form
            onSubmit={handlePincodeCheck}
            className="rounded-xl border border-neutral-200 p-4"
          >
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-900">
              <MapPin size={16} className="text-neutral-500" />
              Check delivery
            </label>
            <div className="mt-2 flex gap-2">
              <input
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ""));
                  setPincodeStatus(null);
                }}
                placeholder="Enter 6-digit pincode"
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                Check
              </button>
            </div>
            {pincodeStatus && (
              <p
                className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                  pincodeStatus.ok ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {pincodeStatus.ok && <Check size={12} />}
                {pincodeStatus.message}
              </p>
            )}
          </form>

          {/* Service highlights */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ServiceItem
              icon={<Truck size={18} />}
              title={
                product.shippingCharge > 0
                  ? `₹${product.shippingCharge} shipping`
                  : "Free shipping"
              }
              subtitle="Ships in 1–2 days"
            />
            <ServiceItem
              icon={<RotateCcw size={18} />}
              title={product.returnPolicy || "No returns"}
              subtitle="Return policy"
            />
            <ServiceItem
              icon={<ShieldCheck size={18} />}
              title="Secure payment"
              subtitle="100% protected"
            />
          </ul>
        </section>
      </div>

      {/* -------------------------------- Tabs -------------------------------- */}
      <div className="mt-16">
        <div className="border-b border-neutral-200">
          <div className="flex gap-6">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: "Reviews" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative -mb-px pb-3 pt-1 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {tab === "description" && (
            <div className="prose prose-sm max-w-none text-neutral-700">
              {product.description ? (
                <p className="leading-relaxed">{product.description}</p>
              ) : (
                <p className="text-neutral-500">
                  No description provided for this product.
                </p>
              )}
            </div>
          )}

          {tab === "specifications" && (
            <SpecificationsTable product={product} variant={selectedVariant} />
          )}

          {tab === "reviews" && (
            <div id="reviews">
              <ReviewsSection
                productId={product._id}
                currentUserId={currentUserId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-neutral-500">Total</div>
            <div className="text-lg font-semibold text-neutral-900 tabular-nums">
              ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCartToggle}
            disabled={outOfStock && !isInCart}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium disabled:opacity-40 ${
              isInCart
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-neutral-900 bg-white text-neutral-900"
            }`}
          >
            <ShoppingBag size={16} />
            {isInCart ? "Remove" : "Cart"}
          </button>
          <button
            type="button"
            disabled={outOfStock}
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Buy now
          </button>
        </div>
      </div>

      <RecentlyViewed excludeId={product._id} title="You recently viewed" className="mt-12" />

      <AuthPromptModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

/* --------------------------- Support components ------------------------- */

const IconChip = ({ children, label, onClick, active }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
      active
        ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
        : "border-neutral-200 bg-white/90 text-neutral-700 hover:bg-white"
    }`}
  >
    {children}
  </button>
);

const ServiceItem = ({ icon, title, subtitle }) => (
  <li className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3">
    <span className="mt-0.5 text-neutral-700">{icon}</span>
    <div>
      <p className="text-sm font-medium text-neutral-900">{title}</p>
      <p className="text-xs text-neutral-500">{subtitle}</p>
    </div>
  </li>
);

const SpecificationsTable = ({ product, variant }) => {
  const rows = [
    ["Brand", product.brand],
    ["SKU", product.sku || variant?.sku],
    ["Color", variant?.color?.name],
    ["Category", product.categoryId?.categoryName],
    ["Return policy", product.returnPolicy],
    ["Warranty", product.warranty],
    ...(Array.isArray(product.specifications)
      ? product.specifications.map((s) => [s.key, s.value])
      : []),
  ].filter(([, v]) => v != null && v !== "");

  if (!rows.length) {
    return (
      <p className="text-sm text-neutral-500">
        No specifications available for this product.
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between gap-4 border-b border-neutral-100 py-2 text-sm"
        >
          <dt className="text-neutral-500">{k}</dt>
          <dd className="text-right font-medium text-neutral-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
};

const DetailSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
    <div className="mb-6 h-4 w-56 animate-pulse rounded bg-neutral-100" />
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
      <div className="space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
        <div className="h-10 w-40 animate-pulse rounded bg-neutral-100" />
        <div className="h-24 w-full animate-pulse rounded bg-neutral-100" />
        <div className="flex gap-3">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetails;