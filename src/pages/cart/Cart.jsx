import { Heart } from "lucide-react";
import { useGetToCart } from "../../api/component/Cart";

const Cart = () => {
  const { data: cartItems = [], isLoading, error } = useGetToCart();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">Error loading cart</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  const formatDate = (dateStr) => dateStr?.split("T")[0];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition relative"
          >
            {/* Image */}
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.productName}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}

            {/* Product Name */}
            {product.productName && (
              <h2 className="text-lg font-semibold">{product.productName}</h2>
            )}

            {/* Brand */}
            {product.brand && (
              <p className="text-gray-600 text-sm">Brand: {product.brand}</p>
            )}

            {/* Price */}
            {product.price && (
              <p className="font-semibold mt-1">
                Price:{" "}
                {product.discountPrice ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      Rs.{product.price}
                    </span>
                    <span className="text-green-600">
                      Rs.{product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span>Rs.{product.price}</span>
                )}
              </p>
            )}

            {/* Stock */}
            {product.stockQuantity !== undefined && (
              <p
                className={`text-sm mt-1 ${
                  product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="mt-2 text-gray-700">{product.description}</p>
            )}

            {/* Sizes */}
            {product.size?.length > 0 && (
              <p className="mt-2">
                Sizes: {product.size.map((s) => s.label || s.name).join(", ")}
              </p>
            )}

            {/* Colors */}
            {product.color?.length > 0 && (
              <p className="mt-1">
                Colors: {product.color.map((c) => c.name).join(", ")}
              </p>
            )}

            {/* Delivery Date */}
            {product.deliveryDate && (
              <p className="mt-1">
                Delivery: {formatDate(product.deliveryDate)}
              </p>
            )}

            {/* Return Policy */}
            {product.returnPolicy && (
              <p className="mt-1">Return Policy: {product.returnPolicy}</p>
            )}

            {/* Shipping Charge */}
            {product.shippingCharge !== undefined && (
              <p className="mt-1">Shipping: Rs.{product.shippingCharge}</p>
            )}

            {/* Quantity input */}
            <div className="mt-4 flex items-center gap-2">
              <label className="font-semibold">Quantity:</label>
              <input
                type="number"
                min="1"
                defaultValue={1}
                className="border p-2 rounded w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                Buy Now
              </button>
              <button className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition flex items-center justify-center gap-2">
                <Heart /> Add to Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
