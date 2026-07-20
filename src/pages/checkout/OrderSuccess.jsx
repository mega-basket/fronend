import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const OrderSuccess = () => {
  const { state } = useLocation();

  // Direct visits without an order go home
  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <CheckCircle2 size={72} className="text-green-500 mx-auto" />
      <h1 className="text-3xl font-bold mt-6">Order Placed!</h1>
      <p className="text-gray-600 mt-2">
        Thank you for shopping with us. A confirmation email is on its way.
      </p>

      <div className="bg-white border rounded-xl p-5 mt-8 text-left shadow-sm">
        <div className="flex justify-between py-1.5">
          <span className="text-gray-500">Order number</span>
          <span className="font-semibold">
            {state.orderNumber || state.orderId}
          </span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-gray-500">Payment</span>
          <span className="font-semibold">
            {state.paymentMethod || "Cash on Delivery"}
          </span>
        </div>
        {state.totalAmount != null && (
          <div className="flex justify-between py-1.5 border-t mt-2 pt-3">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-lg">Rs.{state.totalAmount}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Link
          to="/orders"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="border px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
