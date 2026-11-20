import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Logo from "./Logo";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Categories", to: "/categories" },
    { label: "Shop", to: "/products" },
    { label: "Deals", to: "/deals" },
    { label: "Wishlist", to: "/wishlist" },
  ],
  Account: [
    { label: "My Orders", to: "/orders" },
    { label: "My Profile", to: "/profile" },
    { label: "Addresses", to: "/addresses" },
    { label: "Sign in", to: "/login" },
  ],
  Support: [
    { label: "Contact Us", to: "/support" },
    { label: "Returns & Refunds", to: "/support" },
    { label: "Shipping Info", to: "/support" },
    { label: "FAQs", to: "/support" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
  ],
};

const PERKS = [
  { icon: Truck, label: "Free shipping over ₹1000" },
  { icon: RotateCcw, label: "7-day easy returns" },
  { icon: ShieldCheck, label: "100% secure payments" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      {/* Perks strip */}
      <div className="border-b border-neutral-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {PERKS.map((perk) => (
            <div key={perk.label} className="flex items-center justify-center gap-3 text-sm text-neutral-600 sm:justify-start">
              <perk.icon size={18} className="text-brand-600" />
              {perk.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
              Fashion, grocery, electronics, beauty and more — everything you
              need, delivered to your door.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-neutral-900">{heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-neutral-500 transition-colors hover:text-brand-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-500 md:flex-row">
          <p>© {year} MegaBasket. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-brand-600">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-brand-600">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
