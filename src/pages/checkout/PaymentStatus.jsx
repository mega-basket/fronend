import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchOrderByPaymentIntent } from "../../api/component/useOrder";

// Landing page for redirect-based Stripe payments (return_url).
// Reads ?payment_intent=... from the URL, confirms the order with the
// backend, then forwards to the normal order-success page.
const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [failed, setFailed] = useState(false);

  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  useEffect(() => {
    if (!paymentIntentId || redirectStatus === "failed") {
      setFailed(true);
      return;
    }

    (async () => {
      try {
        const order = await fetchOrderByPaymentIntent(paymentIntentId);
        queryClient.invalidateQueries({ queryKey: ["addToCart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        navigate("/order-success", {
          state: {
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            paymentMethod: "Card / UPI (Paid)",
          },
          replace: true,
        });
      } catch {
        setFailed(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentId]);

  if (failed)
    return (
      <div className="max-w-lg mx-auto text-center py-24 px-4">
        <XCircle size={64} className="text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-6">Payment not completed</h1>
        <p className="text-gray-600 mt-2">
          Your payment didn't go through or is still processing. If money was
          deducted, check My Orders in a few minutes — no order means no
          charge is kept.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
          <Link
            to="/orders"
            className="border px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            My Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto text-center py-24 px-4">
      <Loader2 size={56} className="mx-auto animate-spin text-blue-600" />
      <h1 className="text-2xl font-bold mt-6">Confirming your payment…</h1>
      <p className="text-gray-600 mt-2">
        Hold on a moment while we place your order.
      </p>
    </div>
  );
};

export default PaymentStatus;
