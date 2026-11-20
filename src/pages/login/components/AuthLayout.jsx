import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Tag } from "lucide-react";
import Logo from "../../../components/common/Logo";

const PERKS = [
  { icon: Tag, label: "Exclusive member deals" },
  { icon: Truck, label: "Track every order in real time" },
  { icon: ShieldCheck, label: "Secure, encrypted checkout" },
];

/** Shared split-panel shell for Login / SignUp. */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-screen bg-slate-50">
    {/* Brand panel */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-neutral-900 p-10 text-white lg:flex">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-brand-900/60" />
      <Link to="/" className="relative z-10">
        <Logo />
      </Link>
      <div className="relative z-10 max-w-md">
        <h2 className="font-display text-3xl font-bold leading-tight">
          Everything you need, delivered to your door.
        </h2>
        <ul className="mt-8 flex flex-col gap-4">
          {PERKS.map((perk) => (
            <li key={perk.label} className="flex items-center gap-3 text-neutral-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <perk.icon size={16} />
              </span>
              {perk.label}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative z-10 text-sm text-neutral-400">© {new Date().getFullYear()} MegaBasket</p>
    </div>

    {/* Form panel */}
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center lg:hidden">
          <Logo />
        </Link>

        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>}

        <div className="mt-6">{children}</div>

        {footer && <p className="mt-6 text-center text-sm text-neutral-600">{footer}</p>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
