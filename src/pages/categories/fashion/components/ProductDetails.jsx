import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { useGetProductById } from "../../../../api/component/productApi";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../../../api/component/useWishlist";
import {
  useGetToCart,
  useAddToCart,
  useRemoveFromCart,
} from "../../../../api/component/Cart";

const ProductDetails = () => {
  const { slug } = useParams();
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Product
  const { data: product, isLoading, error } = useGetProductById(slug);

  // Selected color variant (images, thumbnail and stock live inside variants)
  const selectedVariant = product?.variants?.[selectedVariantIdx];

  // Wishlist
  const addWishlist = useWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const { data: wishlist = [], isLoading: wlLoading } = useGetWishlist();

  // Cart
  const { data: cartData = [], isLoading: cartLoading } = useGetToCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  // Determine wishlist & cart status
  const isWishlisted = product
    ? wishlist.some((item) => item._id === product._id)
    : false;
  // Cart items are { _id, product, variant, quantity, ... } — match on product + variant
  const cartItem =
    product && selectedVariant
      ? cartData.find(
          (item) =>
            item.product?._id === product._id &&
            item.variant?._id === selectedVariant._id
        )
      : null;
  const isInCart = !!cartItem;

  // Set main image when product loads or variant changes
  useEffect(() => {
    if (selectedVariant?.thumbnail) setMainImage(selectedVariant.thumbnail);
    setQuantity(1);
  }, [selectedVariant]);

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;

    if (isWishlisted) {
      removeWishlist.mutate(
        { productId: product._id },
        { onSuccess: () => toast.success("Removed from wishlist") }
      );
    } else {
      addWishlist.mutate(
        { productId: product._id },
        { onSuccess: () => toast.success("Added to wishlist") }
      );
    }
  };

  // Cart toggle
  const handleCartToggle = () => {
    if (!product) return;

    if (!selectedVariant) {
      toast.error("Please select a color");
      return;
    }

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
            toast.error(err.response?.data?.message || "Failed to add to cart"),
        }
      );
    }
  };

  if (isLoading || wlLoading || cartLoading)
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-10 mt-6">
          <div className="w-full lg:w-[480px] h-[480px] bg-gray-200 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center mt-20">
        <p className="text-2xl font-semibold text-gray-700">
          Product not found
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          Back to home
        </Link>
      </div>
    );

  const allImages = selectedVariant
    ? [selectedVariant.thumbnail, ...(selectedVariant.images || [])].filter(
        Boolean
      )
    : [];

  const outOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;
  const lowStock =
    !outOfStock &&
    selectedVariant.stockQuantity > 0 &&
    selectedVariant.stockQuantity <= 5;
  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight size={14} />
        {product.categoryId?.categoryName && (
          <>
            <Link
              to={`/products?categoryId=${product.categoryId._id}`}
              className="hover:text-blue-600"
            >
              {product.categoryId.categoryName}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-800 font-medium truncate max-w-[200px]">
          {product.productName}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ---------- Gallery ---------- */}
        <div className="lg:w-[520px] w-full">
          <div className="relative bg-gray-50 border rounded-2xl overflow-hidden group">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  -{discountPercent}% OFF
                </span>
              )}
              {outOfStock && (
                <span className="bg-gray-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Wishlist heart on image */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-full shadow hover:scale-110 transition"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
                }
              />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    mainImage === img
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`view ${idx + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Info ---------- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Brand + name */}
          {product.brand && (
            <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
              {product.brand}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 -mt-2">
            {product.productName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white text-sm font-semibold px-2 py-0.5 rounded">
              {product.avgRating || 0}
              <Star size={14} className="fill-white" />
            </div>
            <span className="text-gray-500 text-sm">
              {product.totalReviews} review{product.totalReviews === 1 ? "" : "s"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-bold text-gray-900">
              Rs.{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through mb-0.5">
                  Rs.{product.price.toLocaleString()}
                </span>
                <span className="text-green-600 font-semibold mb-0.5">
                  Save Rs.{(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 -mt-2">Inclusive of all taxes</p>

          {product.description && (
            <p className="text-gray-600 leading-relaxed border-t pt-4">
              {product.description}
            </p>
          )}

          {/* Color / variant selector */}
          {product.variants?.length > 0 && (
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-900 mb-2">
                Color:{" "}
                <span className="font-normal text-gray-600">
                  {selectedVariant?.color?.name}
                </span>
              </p>
              <div className="flex items-center gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v._id || idx}
                    type="button"
                    title={v.color?.name}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`w-9 h-9 rounded-full border-2 transition ${
                      selectedVariantIdx === idx
                        ? "border-blue-600 ring-2 ring-blue-200 scale-110"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    style={{
                      backgroundColor: v.color?.name?.toLowerCase() || "gray",
                    }}
                  ></button>
                ))}
              </div>
              {/* Stock hint */}
              <p
                className={`text-sm mt-2 font-medium ${
                  outOfStock
                    ? "text-red-600"
                    : lowStock
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {outOfStock
                  ? "Out of stock"
                  : lowStock
                  ? `Only ${selectedVariant.stockQuantity} left — order soon!`
                  : "In stock"}
              </p>
            </div>
          )}

          {/* Quantity */}
          {!outOfStock && !isInCart && (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-lg font-semibold"
                >
                  −
                </button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedVariant.stockQuantity, q + 1)
                    )
                  }
                  className="px-3 py-1.5 hover:bg-gray-100 text-lg font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2 flex-wrap">
            <button
              disabled={outOfStock}
              className="flex-1 min-w-[160px] bg-orange-500 text-white px-6 py-3.5 rounded-xl hover:bg-orange-600 transition font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={handleCartToggle}
              disabled={outOfStock && !isInCart}
              className={`flex-1 min-w-[160px] px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                isInCart
                  ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <ShoppingCart size={20} />
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>

          {/* Service highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border rounded-xl p-4 mt-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-600 shrink-0" size={22} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.shippingCharge > 0
                    ? `Rs.${product.shippingCharge} Shipping`
                    : "Free Shipping"}
                </p>
                <p className="text-xs text-gray-500">On this product</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="text-blue-600 shrink-0" size={22} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.returnPolicy || "No Return"}
                </p>
                <p className="text-xs text-gray-500">Return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600 shrink-0" size={22} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
