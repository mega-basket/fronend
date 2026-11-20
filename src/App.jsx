import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/home/Home";
import ScrollToTop from "./components/common/ScrollToTop";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/layout/RequireAuth";
import { PageLoader } from "./components/ui/Spinner";

// Home is the landing page, so it ships in the main bundle. Every other
// page is split into its own chunk and only downloaded when visited.
const Products = lazy(() => import("./pages/products/Products"));
const ProductDetails = lazy(() => import("./pages/products/components/ProductDetails"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Wishlist = lazy(() => import("./pages/wishlist/Wishlist"));
const Cart = lazy(() => import("./pages/cart/Cart"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const OrderSuccess = lazy(() => import("./pages/checkout/OrderSuccess"));
const PaymentStatus = lazy(() => import("./pages/checkout/PaymentStatus"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Login = lazy(() => import("./pages/login/Login"));
const SignUp = lazy(() => import("./pages/login/SignUp"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));

function App() {
  // Prevent scroll wheel from incrementing/decrementing number inputs
  useEffect(() => {
    const handler = (e) => {
      if (e.target.type === "number") e.preventDefault();
    };
    document.addEventListener("wheel", handler, { passive: false });
    return () => document.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Layout wrapper */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />

                {/* Account-only pages */}
                <Route element={<RequireAuth />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/payment-status" element={<PaymentStatus />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Pages without Layout */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
