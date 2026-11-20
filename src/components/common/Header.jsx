import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Package,
  MapPin,
  Settings,
  ChevronDown,
} from "lucide-react";
import Logo from "./Logo";
import { useGetWishlist } from "../../api/component/useWishlist";
import { useGetToCart } from "../../api/component/Cart";
import SearchInput from "../ui/Search";

/**
 * Header
 * ------
 * - Hairline border, not shadow (matches modern e-commerce headers).
 * - Neutral-900 primary; rose only on the wishlist icon when populated.
 * - Auth state initialised lazily so no flash-of-Login.
 * - Profile dropdown consolidates Profile/Orders/Addresses/Logout.
 * - Mobile: search collapses into an icon; nav lives in a slide-in drawer.
 */
function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const { data: wishlist = [] } = useGetWishlist();
  const { data: cartData = [] } = useGetToCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  const wishlistCount = wishlist?.length ?? 0;
  const cartCount = cartData?.length ?? 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-neutral-900 font-medium"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Search (desktop) */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchInput />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 md:hidden"
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
            >
              <SearchIcon />
            </button>

            <IconButton
              onClick={() => navigate("/wishlist")}
              label="Wishlist"
              count={wishlistCount}
              accent="rose"
            >
              <Heart size={20} />
            </IconButton>

            <IconButton
              onClick={() => navigate("/cart")}
              label="Shopping cart"
              count={cartCount}
              accent="neutral"
            >
              <ShoppingBag size={20} />
            </IconButton>

            {/* Auth */}
            {!user ? (
              <Link
                to="/login"
                className="ml-1 hidden rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:inline-flex"
              >
                Sign in
              </Link>
            ) : (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full p-0.5 pr-2 hover:bg-neutral-100"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <Avatar user={user} />
                  <ChevronDown
                    size={14}
                    className={`hidden text-neutral-500 transition-transform sm:block ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
                  >
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {user.name || "Account"}
                      </p>
                      {user.email && (
                        <p className="truncate text-xs text-neutral-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div className="py-1">
                      {PROFILE_LINKS.map((l) => (
                        <MenuLink
                          key={l.to}
                          to={l.to}
                          icon={l.icon}
                          onClick={() => setProfileOpen(false)}
                        >
                          {l.label}
                        </MenuLink>
                      ))}
                    </div>
                    <div className="border-t border-neutral-100 py-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile search drawer (below the header row) */}
        {mobileSearchOpen && (
          <div className="border-t border-neutral-100 bg-white px-4 py-3 md:hidden">
            <SearchInput autoFocus onSelect={() => setMobileSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <MobileDrawer
          user={user}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogOut}
        />
      )}
    </>
  );
}

/* ------------------------------ Config ---------------------------------- */

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/deals", label: "Deals" },
];

const PROFILE_LINKS = [
  { to: "/profile", label: "My profile", icon: <User size={16} /> },
  { to: "/orders", label: "My orders", icon: <Package size={16} /> },
  { to: "/addresses", label: "Addresses", icon: <MapPin size={16} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={16} /> },
];

/* ------------------------------ Bits ------------------------------------ */

const IconButton = ({ children, onClick, label, count = 0, accent = "neutral" }) => {
  const badge =
    accent === "rose"
      ? "bg-rose-500 text-white"
      : "bg-neutral-900 text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count} items)` : label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      {children}
      {count > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums leading-none ${badge}`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

const Avatar = ({ user }) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || "Profile"}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  const initial = (user?.name || "U").charAt(0).toUpperCase();
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
      {initial}
    </span>
  );
};

const MenuLink = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    role="menuitem"
    onClick={onClick}
    className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
  >
    <span className="text-neutral-500">{icon}</span>
    {children}
  </Link>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="m20 20-3.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* --------------------------- Mobile drawer ------------------------------ */

const MobileDrawer = ({ user, onClose, onLogout }) => (
  <div className="fixed inset-0 z-50 lg:hidden">
    <button
      type="button"
      onClick={onClose}
      aria-label="Close menu"
      className="absolute inset-0 bg-neutral-900/40"
    />
    <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <Link to="/" onClick={onClose} className="flex items-center gap-2">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {user && (
        <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-4">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {user.name || "Account"}
            </p>
            {user.email && (
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-3">
        <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Browse
        </p>
        {NAV_LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive
                  ? "bg-neutral-100 font-medium text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}

        {user && (
          <>
            <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
              Account
            </p>
            {PROFILE_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <span className="text-neutral-500">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-neutral-200 p-3">
        {user ? (
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={16} />
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Sign in
          </Link>
        )}
      </div>
    </aside>
  </div>
);

export default Header;