import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useGetProductById } from "../../../../api/component/productApi";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../../../api/component/useWishlist";
import toast from "react-hot-toast";
import { useAddToCart } from "../../../../api/component/Cart";

const ProductDetails = () => {
  const { id } = useParams();
  const [isClicked, setIsClicked] = useState(false);
  const { data: product, isLoading, error } = useGetProductById(id);
  const addWishlist = useWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const { data: wishlist = [], isLoading: wlLoading } = useGetWishlist();
  const { data: cartData = [], isLoading: cartLoading } = useAddToCart();
  const addToCart = useAddToCart();
  const [mainImage, setMainImage] = useState(null);

  const isWishlisted = product
    ? wishlist.some((item) => item._id === product._id)
    : false;

  useEffect(() => {
    if (product?.thumbnail) setMainImage(product.thumbnail);
  }, [product]);

  const handleWishlistToggle = () => {
    if (!product) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

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

  const isInCart = cartData
    ? cartData?.some((item) => item._id === product?._id)
    : false;
  console.log("isInCart", isInCart);

  const handleCartToggle = () => {
    if (!product) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    if (isInCart) {
      addToCart.mutate(
        { productId: product._id },
        { onSuccess: () => toast.success("Already in cart") }
      );
    } else {
      addToCart.mutate(
        { productId: product._id },
        { onSuccess: () => toast.success("Added to cart") }
      );
    }
  };

  if (isLoading || wlLoading)
    return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center mt-10">Error loading product</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const allImages = [product.thumbnail, ...(product.images || [])];

  const formatDate = (dateStr) => dateStr?.split("T")[0];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Images */}
        <div className="flex gap-6">
          {/* Thumbnails */}
          <div
            className={`flex flex-col gap-4 ${
              allImages.length > 4 ? "overflow-y-auto max-h-[70vh] pr-2" : ""
            }`}
          >
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform border ${
                  mainImage === img
                    ? "border-blue-600 border-2"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="relative">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-[400px] h-[500px] object-cover rounded-lg shadow-lg"
            />
            {product.stockQuantity === 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Title & Rating */}
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" />
            <span className="font-semibold">{product.avgRating} / 5</span>
            <span className="text-gray-500">
              ({product.totalReviews} reviews)
            </span>
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-gray-600">Brand: {product.brand}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            {product.discountPrice && (
              <span className="text-gray-400 line-through text-lg">
                Rs.{product.price}
              </span>
            )}
            {product.discountPrice ? (
              <span className="text-2xl font-bold text-green-600">
                Rs.{product.discountPrice}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                Rs.{product.price}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-700">{product.description}</p>
          )}

          {/* Sizes */}
          {product.size?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="font-semibold mr-2">Sizes:</span>
              {product.size.map((s) => (
                <span
                  key={s._id}
                  className="px-3 py-1 border rounded-full text-sm bg-gray-100"
                >
                  {s.label}
                </span>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.color?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="font-semibold mr-2">Colors:</span>
              {product.color.map((c) => (
                <span
                  key={c._id}
                  className={`w-6 h-6 rounded-full border`}
                  style={{ backgroundColor: c.name.toLowerCase() }}
                ></span>
              ))}
            </div>
          )}

          {/* Delivery & Shipping */}
          <div className="flex gap-4 text-gray-600">
            {product.deliveryDate && (
              <span>Delivery: {formatDate(product.deliveryDate)}</span>
            )}
            {product.shippingCharge && (
              <span>Shipping: Rs.{product.shippingCharge}</span>
            )}
            {product.returnPolicy && (
              <span>Return: {product.returnPolicy}</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mt-4">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              defaultValue={1}
              className="border rounded p-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-semibold">
              Buy It Now
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition flex items-center gap-2"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={isWishlisted ? "text-red-500 fill-red-500" : ""}
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <button
              onClick={handleCartToggle}
              className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full hover:bg-blue-200 transition font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
