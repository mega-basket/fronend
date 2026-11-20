import { PackageCheck } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { formatInr } from "../../../components/ui/formatInr";
import Button from "../../../components/ui/Button";
import StripePaymentForm from "../StripePaymentForm";

const OrderSummary = ({
  summary,
  validating,
  clientSecret,
  stripePromise,
  onPlaceOrder,
  onCancelPayment,
  placing,
  paymentMethod,
}) => (
  <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-card lg:w-96">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
      <PackageCheck size={20} className="text-brand-600" />
      Order Summary
    </h2>

    {validating && <p className="text-sm text-neutral-500">Validating cart…</p>}

    {summary ? (
      <>
        <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
          {summary.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-neutral-700">
                {item.productName}
                {item.variant && <span className="text-neutral-400"> ({item.variant})</span>} × {item.quantity}
              </span>
              <span className="font-medium">{formatInr(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-neutral-100" />
        <div className="mb-1.5 flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>{formatInr(summary.subtotal)}</span>
        </div>
        <div className="mb-1.5 flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span>{summary.shippingCharge === 0 ? "Free" : formatInr(summary.shippingCharge)}</span>
        </div>
        <hr className="my-3 border-neutral-100" />
        <div className="flex justify-between text-lg font-bold text-neutral-900">
          <span>Total</span>
          <span>{formatInr(summary.totalAmount)}</span>
        </div>
      </>
    ) : (
      !validating && (
        <p className="text-sm text-neutral-500">Select a delivery address to see the final total.</p>
      )
    )}

    {clientSecret ? (
      <div className="mt-5">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm totalAmount={summary?.totalAmount} onCancel={onCancelPayment} />
        </Elements>
      </div>
    ) : (
      <>
        <Button fullWidth size="lg" className="mt-5" onClick={onPlaceOrder} loading={placing} disabled={!summary}>
          {paymentMethod === "ONLINE" ? "Continue to Payment" : "Place Order"}
        </Button>
        <p className="mt-3 text-center text-xs text-neutral-400">
          By placing this order you agree to our terms & conditions.
        </p>
      </>
    )}
  </div>
);

export default OrderSummary;
