import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchOrderByPaymentIntent } from "../../api/component/useOrder";
import { PageLoader } from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";

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
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <XCircle size={36} className="text-rose-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">Payment not completed</h1>
        <p className="mt-2 text-neutral-500">
          Your payment didn't go through or is still processing. If money was
          deducted, check My Orders in a few minutes — no order means no
          charge is kept.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/checkout">
            Try Again
          </Button>
          <Button as={Link} to="/orders" variant="outline">
            My Orders
          </Button>
        </div>
      </div>
    );

  return <PageLoader label="Confirming your payment…" />;
};

export default PaymentStatus;
