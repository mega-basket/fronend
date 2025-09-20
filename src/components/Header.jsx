import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo";
import { BiSearch, BiUser } from "react-icons/bi";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

function Header() {
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLogin(!!storedUser);
  }, []);

  const handleLogOut = () => {
    localStorage.clear("user");
    setIsLogin(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="glass soft-shadow bg-white text-black">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <Logo />
            </a>

            <div className="hidden md:flex flex-1">
              <div className="w-full relative">
                <input
                  ref={desktopSearchRef}
                  type="search"
                  placeholder="Search products, brands, and categories..."
                  className="w-full rounded-2xl pl-11 pr-12 py-2.5 bg-white/70 dark:bg-blue-600/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <BiSearch
                  size={24}
                  className="w-5 h-5 mt-1 absolute flex items-center  left-3 top-2.5 text-slate-500"
                />
                <button className="absolute right-1 top-1 rounded-xl px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                  Search
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/30">
                <span className="text-sm font-medium">Support</span>
              </button>
              <button
                className="relative rounded-xl p-2 hover:bg-blue-500/30"
                aria-label="Wishlist"
              >
                <Heart size={24} />
              </button>
              <button
                className="relative rounded-xl p-2 hover:bg-white/30"
                aria-label="Cart"
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-semibold">
                  1
                </span>
              </button>
              {!isLogin ? (
                <button
                  className="rounded-xl p-2 hover:bg-white/30"
                  aria-label="Profile"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              ) : (
                <div className="flex">
                  <button
                    className="rounded-xl p-2 hover:bg-white/30"
                    aria-label="Profile"
                    onClick={() => navigate("/profile")}
                  >
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_xUfgsEggfsK-KqiOJYgPrPSqtRyQzC0fw&s"
                      alt="image"
                      className="w-10 rounded-full"
                    />
                  </button>
                  <button
                    className="rounded-xl p-2 hover:bg-white/30"
                    aria-label="Profile"
                    onClick={handleLogOut}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 md:hidden">
            <div className="relative">
              <input
                ref={mobileSearchRef}
                type="search"
                placeholder="Search products, brands, and categories..."
                className="w-full rounded-2xl pl-11 pr-4 py-2.5 bg-white/70 dark:bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <BiSearch className="w-5 h-5 my-1 absolute left-3 top-2.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
