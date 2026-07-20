import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetWishlist,
  useRemoveFromWishlist,
} from "../../api/component/useWishlist";
import { Star } from "lucide-react";

const Wishlist = () => {
  const navigate = useNavigate();
  const { data: wishlist, isLoading, error } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (productId) => {
    removeFromWishlist.mutate({ productId });
  };

  if (isLoading) {
    return (
      <p className="flex items-center justify-center font-bold text-lg">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <p className="flex items-center justify-center font-bold text-lg text-red-600">
        Failed to load wishlist.
      </p>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <p className="flex items-center justify-center font-bold text-lg">
        Your wishlist is empty.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="flex items-center p-2 border cursor-pointer rounded-lg bg-white"
        >
          <div
            className="flex gap-3 items-center bg-white/50 rounded"
            onClick={() => navigate(`/products/${item.slug}`)}
          >
            <img
              className="w-24 h-24 object-cover border rounded-lg"
              src={item.variants?.[0]?.thumbnail}
              alt={item.productName}
            />
            <div>
              <p className="font-semibold">{item.productName}</p>
              {item.brand && (
                <p className="text-sm text-gray-600">{item.brand}</p>
              )}
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <Star size={16} fill="gold" stroke="gold" /> {item.avgRating} (
                {item.totalReviews} Reviews)
              </p>
              <p className="mt-1">
                {item.discountPrice && item.discountPrice < item.price ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      Rs.{item.price}
                    </span>
                    <span className="font-semibold text-green-600">
                      Rs.{item.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">Rs.{item.price}</span>
                )}
              </p>
            </div>
          </div>

          <button
            className="ml-auto p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => handleRemove(item._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
