import React, { useState } from "react";
import { useAddToCart, useGetToCart } from "../../api/component/Cart";
import { useGetProductById } from "../../api/component/productApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PopularProducts = ({ popularProducts }) => {
  const { slug } = useParams();
  const [isClicked, setIsClicked] = useState(false);

  // Fetch product details if you need it (optional)
  const { data: product, isLoading, error } = useGetProductById(slug);

  // Fetch cart items
  const { data: cartData = [] } = useGetToCart();

  // Add to cart mutation
  const addToCart = useAddToCart();

  const handleCartToggle = (product) => {
    if (!product) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    const isInCart = cartData?.some((item) => item._id === product._id);

    addToCart.mutate(
      { productId: product._id },
      {
        onSuccess: () => {
          toast.success(isInCart ? "Already in cart" : "Added to cart");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to add to cart");
        },
      }
    );
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading product.</p>;

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Popular Products
        </h2>
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm md:text-base"
        >
          See all
        </a>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {popularProducts?.map((prod) => (
          <div
            key={prod._id}
            className="flex-none w-[200px] sm:w-[220px] bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <img
              src={prod.thumbnail}
              alt={prod.productName}
              className="w-full h-44 object-cover rounded-t-2xl"
            />
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                {prod.productName}
              </h3>
              <p className="text-gray-500 text-sm mt-1">₹{prod.price}</p>
              <button
                onClick={handleCartToggle}
                className={`mt-3 w-full bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 transition ${
                  isClicked ? "scale-95" : ""
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
