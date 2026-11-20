import { Banknote, CreditCard } from "lucide-react";

const inputCls =
  "border border-neutral-200 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const PaymentSection = ({ paymentMethod, onChange, notes, onNotesChange }) => (
  <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
      <Banknote size={20} className="text-brand-600" />
      2. Payment Method
    </h2>

    <div className="flex flex-col gap-3">
      <label
        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
          paymentMethod === "COD"
            ? "border-neutral-900 ring-2 ring-neutral-100 bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-400"
        }`}
      >
        <input type="radio" name="payment" className="accent-neutral-900" checked={paymentMethod === "COD"} onChange={() => onChange("COD")} />
        <Banknote size={20} className="text-emerald-600" />
        <div>
          <p className="font-semibold text-neutral-900">Cash on Delivery</p>
          <p className="text-sm text-neutral-500">Pay when your order arrives</p>
        </div>
      </label>
      <label
        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
          paymentMethod === "ONLINE"
            ? "border-neutral-900 ring-2 ring-neutral-100 bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-400"
        }`}
      >
        <input type="radio" name="payment" className="accent-neutral-900" checked={paymentMethod === "ONLINE"} onChange={() => onChange("ONLINE")} />
        <CreditCard size={20} className="text-brand-600" />
        <div>
          <p className="font-semibold text-neutral-900">Card / UPI (Online)</p>
          <p className="text-sm text-neutral-500">Pay securely via Stripe</p>
        </div>
      </label>
    </div>

    <textarea
      className={`${inputCls} mt-4`}
      rows={2}
      placeholder="Order notes (optional)"
      value={notes}
      onChange={(e) => onNotesChange(e.target.value)}
    />
  </section>
);

export default PaymentSection;
