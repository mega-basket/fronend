import { useNavigate } from "react-router-dom";
import { formatInr } from "../../../components/ui/formatInr";
import Button from "../../../components/ui/Button";

const CartSummary = ({ subtotal, shippingCharge }) => {
  const navigate = useNavigate();

  return (
    <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-card lg:w-80">
      <h2 className="mb-4 text-lg font-bold text-neutral-900">Order Summary</h2>
      <div className="mb-2 flex justify-between text-neutral-600">
        <span>Subtotal</span>
        <span>{formatInr(subtotal)}</span>
      </div>
      <div className="mb-2 flex justify-between text-neutral-600">
        <span>Shipping</span>
        <span className={shippingCharge === 0 ? "font-medium text-emerald-600" : ""}>
          {shippingCharge === 0 ? "Free" : formatInr(shippingCharge)}
        </span>
      </div>
      <hr className="my-3 border-neutral-100" />
      <div className="flex justify-between text-lg font-bold text-neutral-900">
        <span>Total</span>
        <span>{formatInr(subtotal + shippingCharge)}</span>
      </div>
      <Button fullWidth size="lg" className="mt-5" onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
