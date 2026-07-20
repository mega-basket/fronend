import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Trash2,
  Banknote,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import StripePaymentForm from "./StripePaymentForm";
import { useGetToCart } from "../../api/component/Cart";
import {
  useGetAddresses,
  useCreateAddress,
  useDeleteAddress,
} from "../../api/component/useAddress";
import {
  useValidateCheckout,
  useCreateOrder,
  useCreatePaymentIntent,
} from "../../api/component/useOrder";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  addressType: "HOME",
  isDefault: false,
};

const Checkout = () => {
  const navigate = useNavigate();

  const { data: cartItems = [], isLoading: cartLoading } = useGetToCart();
  const { data: addresses = [], isLoading: addrLoading } = useGetAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const validateCheckout = useValidateCheckout();
  const createOrder = useCreateOrder();
  const createPaymentIntent = useCreatePaymentIntent();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Preselect the default (or first) address
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses, selectedAddressId]);

  // Re-validate with the backend whenever the chosen address changes
  useEffect(() => {
    if (!selectedAddressId || cartItems.length === 0) return;
    setClientSecret(null); // amount may change — restart any pending payment
    validateCheckout.mutate(
      { addressId: selectedAddressId },
      {
        onSuccess: (data) => setSummary(data),
        onError: (err) => {
          setSummary(null);
          toast.error(
            err.response?.data?.message || "Cart validation failed"
          );
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, cartItems.length]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    createAddress.mutate(form, {
      onSuccess: (data) => {
        toast.success("Address added");
        setShowAddressForm(false);
        setForm(emptyForm);
        if (data.address?._id) setSelectedAddressId(data.address._id);
      },
      onError: (err) =>
        toast.error(err.response?.data?.message || "Failed to add address"),
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (paymentMethod === "ONLINE") {
      // Get a PaymentIntent from the backend, then show the Stripe form
      createPaymentIntent.mutate(
        { addressId: selectedAddressId, notes },
        {
          onSuccess: (data) => setClientSecret(data.clientSecret),
          onError: (err) =>
            toast.error(
              err.response?.data?.message || "Failed to start payment"
            ),
        }
      );
      return;
    }

    createOrder.mutate(
      { addressId: selectedAddressId, paymentMethod: "COD", notes },
      {
        onSuccess: (data) => {
          navigate("/order-success", {
            state: {
              orderId: data.orderId,
              orderNumber: data.orderNumber,
              totalAmount: data.totalAmount,
            },
            replace: true,
          });
        },
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to place order"),
      }
    );
  };

  if (cartLoading || addrLoading)
    return <p className="text-center mt-10">Loading…</p>;

  if (cartItems.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-xl font-semibold text-gray-700">
          Your cart is empty
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Continue shopping
        </button>
      </div>
    );

  const inputCls =
    "border rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---------- Left column: address + payment ---------- */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Step 1: Address */}
          <section className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-blue-600" />
              1. Delivery Address
            </h2>

            {addresses.length === 0 && !showAddressForm && (
              <p className="text-gray-500 mb-3">
                No saved addresses — add one to continue.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition ${
                    selectedAddressId === addr._id
                      ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/40"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1.5"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">
                      {addr.fullName}
                      {addr.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      {addr.addressType && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {addr.addressType}
                        </span>
                      )}
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {addr.street}, {addr.city}, {addr.state} —{" "}
                      {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-gray-600 text-sm">Phone: {addr.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteAddress.mutate(addr._id, {
                        onSuccess: () => {
                          toast.success("Address removed");
                          if (selectedAddressId === addr._id)
                            setSelectedAddressId(null);
                        },
                      });
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition"
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </label>
              ))}
            </div>

            {showAddressForm ? (
              <form
                onSubmit={handleSaveAddress}
                className="mt-4 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <input
                  className={inputCls}
                  name="fullName"
                  placeholder="Full name *"
                  value={form.fullName}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={inputCls}
                  name="phone"
                  placeholder="Phone *"
                  value={form.phone}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={`${inputCls} sm:col-span-2`}
                  name="street"
                  placeholder="Street / house / area *"
                  value={form.street}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={inputCls}
                  name="city"
                  placeholder="City *"
                  value={form.city}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={inputCls}
                  name="state"
                  placeholder="State *"
                  value={form.state}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={inputCls}
                  name="postalCode"
                  placeholder="PIN code *"
                  value={form.postalCode}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className={inputCls}
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleFormChange}
                />
                <select
                  className={inputCls}
                  name="addressType"
                  value={form.addressType}
                  onChange={handleFormChange}
                >
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleFormChange}
                  />
                  Set as default address
                </label>
                <div className="sm:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={createAddress.isPending}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {createAddress.isPending ? "Saving…" : "Save Address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-5 py-2.5 rounded-lg border font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                <Plus size={18} /> Add new address
              </button>
            )}
          </section>

          {/* Step 2: Payment method */}
          <section className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Banknote size={20} className="text-blue-600" />
              2. Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <Banknote size={20} className="text-green-600" />
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === "ONLINE"
                    ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                <CreditCard size={20} className="text-purple-600" />
                <div>
                  <p className="font-semibold">Card / UPI (Online)</p>
                  <p className="text-sm text-gray-500">
                    Pay securely via Stripe
                  </p>
                </div>
              </label>
            </div>

            <textarea
              className={`${inputCls} mt-4`}
              rows={2}
              placeholder="Order notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>

        {/* ---------- Right column: order summary ---------- */}
        <div className="lg:w-96 bg-white border rounded-xl p-5 shadow-sm h-fit">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <PackageCheck size={20} className="text-blue-600" />
            Order Summary
          </h2>

          {validateCheckout.isPending && (
            <p className="text-gray-500 text-sm">Validating cart…</p>
          )}

          {summary ? (
            <>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                {summary.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.productName}
                      {item.variant && (
                        <span className="text-gray-400"> ({item.variant})</span>
                      )}{" "}
                      × {item.quantity}
                    </span>
                    <span className="font-medium">Rs.{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-gray-700 mb-1.5">
                <span>Subtotal</span>
                <span>Rs.{summary.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-1.5">
                <span>Shipping</span>
                <span>
                  {summary.shippingCharge === 0
                    ? "Free"
                    : `Rs.${summary.shippingCharge}`}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs.{summary.totalAmount}</span>
              </div>
            </>
          ) : (
            !validateCheckout.isPending && (
              <p className="text-gray-500 text-sm">
                Select a delivery address to see the final total.
              </p>
            )
          )}

          {clientSecret ? (
            <div className="mt-5">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  totalAmount={summary?.totalAmount}
                  onCancel={() => setClientSecret(null)}
                />
              </Elements>
            </div>
          ) : (
            <>
              <button
                onClick={handlePlaceOrder}
                disabled={
                  !summary ||
                  createOrder.isPending ||
                  createPaymentIntent.isPending
                }
                className="w-full mt-5 bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createOrder.isPending || createPaymentIntent.isPending
                  ? "Please wait…"
                  : paymentMethod === "ONLINE"
                  ? "Continue to Payment"
                  : "Place Order"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                By placing this order you agree to our terms & conditions.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
