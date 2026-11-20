import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatInr } from "../../components/ui/formatInr";
import Button from "../../components/ui/Button";

const OrderSuccess = () => {
  const { state } = useLocation();

  // Direct visits without an order go home
  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 size={36} className="text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-neutral-900">Order Placed!</h1>
      <p className="mt-2 text-neutral-500">
        Thank you for shopping with us. A confirmation email is on its way.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-card">
        <div className="flex justify-between py-1.5">
          <span className="text-neutral-500">Order number</span>
          <span className="font-semibold text-neutral-900">{state.orderNumber || state.orderId}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-neutral-500">Payment</span>
          <span className="font-semibold text-neutral-900">{state.paymentMethod || "Cash on Delivery"}</span>
        </div>
        {state.totalAmount != null && (
          <div className="mt-2 flex justify-between border-t border-neutral-100 py-1.5 pt-3">
            <span className="text-neutral-500">Total</span>
            <span className="text-lg font-bold text-neutral-900">{formatInr(state.totalAmount)}</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button as={Link} to="/orders">
          View My Orders
        </Button>
        <Button as={Link} to="/" variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
