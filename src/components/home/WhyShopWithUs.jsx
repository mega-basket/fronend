import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const POINTS = [
  { icon: Truck, title: "Free shipping", subtitle: "On orders over ₹1000" },
  { icon: RotateCcw, title: "7-day returns", subtitle: "No questions asked" },
  { icon: ShieldCheck, title: "Secure payments", subtitle: "100% protected checkout" },
  { icon: Headset, title: "24/7 support", subtitle: "We're here to help" },
];

const WhyShopWithUs = () => (
  <section className="px-4 py-10 md:py-14">
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card sm:grid-cols-4 sm:p-8">
      {POINTS.map((p) => (
        <div key={p.title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <p.icon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{p.title}</p>
            <p className="text-xs text-neutral-500">{p.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default WhyShopWithUs;
