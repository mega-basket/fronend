import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

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
import { CheckoutSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import AddressSection from "./components/AddressSection";
import PaymentSection from "./components/PaymentSection";
import OrderSummary from "./components/OrderSummary";
import useFormValidation from "../../hooks/useFormValidation";
import { maxLength, minLength, phone, pincode, required } from "../../utils/validation";

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

const ADDRESS_SCHEMA = {
  fullName: [required("Full name is required"), minLength(2, "Name must be at least 2 characters"), maxLength(60)],
  phone: [required("Phone number is required"), phone()],
  street: [required("Street address is required"), minLength(5, "Please enter a complete address"), maxLength(200)],
  city: [required("City is required"), maxLength(50)],
  state: [required("State is required"), maxLength(50)],
  postalCode: [required("PIN code is required"), pincode()],
  country: [maxLength(50)],
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
  const addressValidation = useFormValidation(ADDRESS_SCHEMA);
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
          toast.error(err.response?.data?.message || "Cart validation failed");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, cartItems.length]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { ...form, [name]: type === "checkbox" ? checked : value };
    setForm(next);
    addressValidation.revalidate(name, next);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressValidation.validateAll(form)) return;
    createAddress.mutate(form, {
      onSuccess: (data) => {
        toast.success("Address added");
        setShowAddressForm(false);
        setForm(emptyForm);
        addressValidation.reset();
        if (data.address?._id) setSelectedAddressId(data.address._id);
      },
      onError: (err) => toast.error(err.response?.data?.message || "Failed to add address"),
    });
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddress.mutate(addressId, {
      onSuccess: () => {
        toast.success("Address removed");
        if (selectedAddressId === addressId) setSelectedAddressId(null);
      },
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (paymentMethod === "ONLINE") {
      createPaymentIntent.mutate(
        { addressId: selectedAddressId, notes },
        {
          onSuccess: (data) => setClientSecret(data.clientSecret),
          onError: (err) => toast.error(err.response?.data?.message || "Failed to start payment"),
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
        onError: (err) => toast.error(err.response?.data?.message || "Failed to place order"),
      }
    );
  };

  if (cartLoading || addrLoading) return <CheckoutSkeleton />;

  if (cartItems.length === 0)
    return (
      <div className="mt-20 text-center">
        <p className="text-xl font-semibold text-neutral-700">Your cart is empty</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/")}>
          Continue shopping
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">Checkout</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <AddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
            showForm={showAddressForm}
            onToggleForm={(open) => {
              setShowAddressForm(open);
              if (!open) addressValidation.reset();
            }}
            form={form}
            errors={addressValidation.errors}
            onFieldBlur={(name) => addressValidation.onBlur(name, form)}
            onFormChange={handleFormChange}
            onSaveAddress={handleSaveAddress}
            onDeleteAddress={handleDeleteAddress}
            saving={createAddress.isPending}
          />

          <PaymentSection
            paymentMethod={paymentMethod}
            onChange={setPaymentMethod}
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>

        <OrderSummary
          summary={summary}
          validating={validateCheckout.isPending}
          clientSecret={clientSecret}
          stripePromise={stripePromise}
          onPlaceOrder={handlePlaceOrder}
          onCancelPayment={() => setClientSecret(null)}
          placing={createOrder.isPending || createPaymentIntent.isPending}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
};

export default Checkout;
