import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetToCart,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../../api/component/Cart";
import EmptyCartImg from "../../assets/empty-cart.png";
import EmptyState from "../../components/ui/EmptyState";
import { PageError } from "../../components/ui/Spinner";
import { CartSkeleton } from "../../components/ui/Skeleton";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cartItems = [], isLoading, error } = useGetToCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();

  if (isLoading) return <CartSkeleton />;
  if (error) return <PageError label="We couldn't load your cart." />;

  if (cartItems.length === 0) {
    return (
      <EmptyState
        image={EmptyCartImg}
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet. Start shopping to fill it with amazing products."
        actionLabel="Continue Shopping"
        onAction={() => navigate("/")}
      />
    );
  }

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    updateQuantity.mutate(
      { productId: item.product._id, variantId: item.variant._id, quantity: newQty },
      { onError: (err) => toast.error(err.response?.data?.message || "Failed to update quantity") }
    );
  };

  // Switch a cart line to another color variant: add the new variant with
  // the same quantity, then remove the old line.
  const handleVariantChange = (item, newVariantId) => {
    if (!newVariantId || newVariantId === item.variant?._id) return;
    addToCart.mutate(
      { productId: item.product._id, variantId: newVariantId, quantity: item.quantity },
      {
        onSuccess: () => {
          removeFromCart.mutate(
            { cartItemId: item._id },
            { onSuccess: () => toast.success("Cart updated") }
          );
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to change variant"),
      }
    );
  };

  const handleRemove = (item) => {
    removeFromCart.mutate(
      { cartItemId: item._id },
      {
        onSuccess: () => toast.success("Removed from cart"),
        onError: (err) => toast.error(err.response?.data?.message || "Couldn't remove item"),
      }
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCharge = subtotal >= 1000 ? 0 : 50;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">My Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
              onRemove={handleRemove}
              quantityPending={updateQuantity.isPending}
              variantPending={addToCart.isPending}
            />
          ))}
        </div>

        <CartSummary subtotal={subtotal} shippingCharge={shippingCharge} />
      </div>
    </div>
  );
};

export default Cart;
