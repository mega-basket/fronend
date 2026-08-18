import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Home from "./components/home/Home";
import Layout from "./components/layout/Layout";
import SignUp from "./pages/login/SignUp";
import Login from "./pages/login/Login";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./pages/categories/fashion/components/ProductDetails";
import Products from "./pages/categories/fashion/Products";
import Wishlist from "./pages/wishlist/Wishlist";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import OrderSuccess from "./pages/checkout/OrderSuccess";
import PaymentStatus from "./pages/checkout/PaymentStatus";
import Orders from "./pages/orders/Orders";
import Categories from "./pages/categories/Categories";

function App() {
  // JS: prevent scroll increment
  document.addEventListener(
    "wheel",
    function (e) {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
          </Route>

          {/* Pages without Layout */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
