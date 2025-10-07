import React, { useState } from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import {
  useGetWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../../../api/component/useWishlist";
import { useGetProductById } from "../../../../api/component/productApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ProductsCard = ({ items }) => {
  const { slug } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const { data: product } = useGetProductById(slug);

  const addWishlist = useWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const { data: wishlist = [] } = useGetWishlist();

  const isWishlisted = product
    ? wishlist.some((item) => item._id === product._id)
    : false;

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

  return (
    <div className="group relative">
      <div
        className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl 
                   shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-102
                   cursor-pointer w-80 border border-gray-100 hover:border-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Action Buttons */}
        <div
          className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 hover:scale-110 ${
              isFavorite
                ? "bg-red-500 text-white border-red-500"
                : "bg-white/80 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            className="p-2 rounded-full bg-white/80 text-gray-600 border border-gray-200 
                           backdrop-blur-sm hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 hover:scale-110"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Discount Badge */}
        {items.discountPrice && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {Math.round(
                ((items.price - items.discountPrice) / items.price) * 100
              )}
              % OFF
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative p-6 pb-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
            {/* Shimmer effect background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           transform -skew-x-12 transition-transform duration-1000 ${
                             isHovered
                               ? "translate-x-full"
                               : "-translate-x-full"
                           }`}
            />

            <img
              src={items.thumbnail || "/api/placeholder/300/300"}
              alt={items.productName}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />

            {/* Overlay gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 
                           group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className="text-yellow-400 fill-current"
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">(4.8)</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 leading-tight">
            {items.productName}
          </h3>

          {/* Price */}
          {items.price && (
            <div className="flex items-center gap-2 mb-4">
              {items.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-gray-800">
                    ₹{items.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{items.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-800">
                  ₹{items.price.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/products/${items.slug}`)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 
                             rounded-xl font-semibold flex items-center justify-center gap-2 
                             hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 
                             transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={18} />
              Buy Now
            </button>
            <button
              onClick={handleWishlistToggle}
              className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold
                             hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 
                         rounded-full blur-3xl transition-all duration-1000 ${
                           isHovered
                             ? "scale-150 opacity-100"
                             : "scale-100 opacity-0"
                         }`}
          />
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-orange-200/20 
                         rounded-full blur-3xl transition-all duration-1000 delay-200 ${
                           isHovered
                             ? "scale-150 opacity-100"
                             : "scale-100 opacity-0"
                         }`}
          />
        </div>
      </div>
    </div>
  );
};
export default ProductsCard;
