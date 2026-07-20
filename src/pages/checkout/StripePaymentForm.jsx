import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { fetchOrderByPaymentIntent } from "../../api/component/useOrder";

// Rendered inside <Elements> with a clientSecret. Confirms the payment and
// then asks the backend for the order created by the webhook (or fallback).
const StripePaymentForm = ({ totalAmount, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect-based methods (e.g. some UPI/wallets) come back here
          return_url: `${window.location.origin}/payment-status`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Webhook (or fallback endpoint) turns the payment into an order
        const order = await fetchOrderByPaymentIntent(paymentIntent.id);
        queryClient.invalidateQueries({ queryKey: ["addToCart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        navigate("/order-success", {
          state: {
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            totalAmount,
            paymentMethod: "Card / UPI (Paid)",
          },
          replace: true,
        });
      } else {
        toast.error("Payment was not completed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Payment received but order confirmation failed — check My Orders"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {processing ? "Processing…" : `Pay Rs.${totalAmount}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-5 py-3.5 rounded-xl border font-semibold hover:bg-gray-50 transition disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Payments are securely processed by Stripe.
      </p>
    </form>
  );
};

export default StripePaymentForm;
