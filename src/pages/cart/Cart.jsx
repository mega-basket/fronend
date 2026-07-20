import { Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetToCart,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../../api/component/Cart";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cartItems = [], isLoading, error } = useGetToCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">Error loading cart</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    updateQuantity.mutate(
      {
        productId: item.product._id,
        variantId: item.variant._id,
        quantity: newQty,
      },
      {
        onError: (err) =>
          toast.error(
            err.response?.data?.message || "Failed to update quantity"
          ),
      }
    );
  };

  // Switch a cart line to another color variant:
  // add the new variant with the same quantity, then remove the old line.
  const handleVariantChange = (item, newVariantId) => {
    if (!newVariantId || newVariantId === item.variant?._id) return;
    addToCart.mutate(
      {
        productId: item.product._id,
        variantId: newVariantId,
        quantity: item.quantity,
      },
      {
        onSuccess: () => {
          removeFromCart.mutate(
            { cartItemId: item._id },
            { onSuccess: () => toast.success("Cart updated") }
          );
        },
        onError: (err) =>
          toast.error(
            err.response?.data?.message || "Failed to change variant"
          ),
      }
    );
  };

  const handleRemove = (item) => {
    removeFromCart.mutate(
      { cartItemId: item._id },
      { onSuccess: () => toast.success("Removed from cart") }
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCharge = subtotal >= 1000 ? 0 : 50;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <img
                src={item.variant?.thumbnail}
                alt={item.product?.productName}
                onClick={() => navigate(`/products/${item.product?.slug}`)}
                className="w-28 h-28 object-cover rounded-lg border cursor-pointer"
              />

              <div className="flex-1">
                <h2
                  className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/products/${item.product?.slug}`)}
                >
                  {item.product?.productName}
                </h2>
                {item.product?.brand && (
                  <p className="text-gray-600 text-sm">
                    Brand: {item.product.brand}
                  </p>
                )}
                {/* Color / variant switcher */}
                {item.product?.variants?.length > 1 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600 text-sm">Color:</span>
                    {item.product.variants.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        title={
                          v.stockQuantity > 0
                            ? v.color?.name
                            : `${v.color?.name} (Out of stock)`
                        }
                        disabled={
                          v.stockQuantity < 1 || addToCart.isPending
                        }
                        onClick={() => handleVariantChange(item, v._id)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          item.variant?._id === v._id
                            ? "border-blue-600 ring-2 ring-blue-100 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                        style={{
                          backgroundColor:
                            v.color?.name?.toLowerCase() || "gray",
                        }}
                      ></button>
                    ))}
                    <span className="text-gray-600 text-sm">
                      {item.variant?.color?.name}
                    </span>
                  </div>
                ) : (
                  item.variant?.color?.name && (
                    <p className="text-gray-600 text-sm">
                      Color: {item.variant.color.name}
                    </p>
                  )
                )}
                <p className="font-semibold mt-1">Rs.{item.priceAtAdd}</p>
                <p
                  className={`text-sm mt-1 ${
                    item.variant?.stockQuantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.variant?.stockQuantity > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </p>

                {/* Quantity controls */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updateQuantity.isPending}
                    className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    disabled={updateQuantity.isPending}
                    className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemove(item)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Remove from cart"
                >
                  <Trash2 size={20} />
                </button>
                <p className="font-bold">Rs.{item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 border rounded-lg p-6 shadow-sm bg-white h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>Rs.{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Shipping</span>
            <span>{shippingCharge === 0 ? "Free" : `Rs.${shippingCharge}`}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs.{subtotal + shippingCharge}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
