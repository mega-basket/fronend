import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo";
import { BiSearch } from "react-icons/bi";
import { Heart, LogOut, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetWishlist } from "../api/component/useWishlist";
import { useGetToCart } from "../api/component/Cart";
import SearchInput from "./ui/Search";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const { data: wishlist } = useGetWishlist();
  const { data: cartData } = useGetToCart();

  // Check login status from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLogin(!!storedUser);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <a href="/" className="flex items-center gap-2">
          <Logo />
        </a>

        {/* Search Box */}
        <SearchInput />

        {/* Wishlist & Cart */}
        <div className="ml-auto flex items-center gap-3">
          <button className="relative" onClick={() => navigate("/wishlist")}>
            <Heart size={24} />
            {wishlist?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs font-semibold rounded-full bg-rose-600 text-white flex items-center justify-center">
                {wishlist?.length}
              </span>
            )}
          </button>
          <button className="relative" onClick={() => navigate("/cart")}>
            <ShoppingCart size={24} />
            {cartData?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs font-semibold rounded-full bg-rose-600 text-white flex items-center justify-center">
                {cartData?.length}
              </span>
            )}
          </button>

          {/* Login / Profile & Logout Buttons */}
          {!isLogin ? (
            <button
              className="rounded-xl p-2 border bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="rounded-full overflow-hidden border"
                onClick={() => navigate("/profile")}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_xUfgsEggfsK-KqiOJYgPrPSqtRyQzC0fw&s"
                  alt="profile"
                  className="w-10 h-10 object-cover"
                />
              </button>
              <button
                className="flex items-center font-poppins px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                onClick={handleLogOut}
              >
                <LogOut className="mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
