import { Headphones, Shirt, GlassWater, Footprints, Watch, Coffee } from "lucide-react";

// Placeholder products shown when the backend has no popular products yet,
// so the homepage still demonstrates the full card UI instead of an empty gap.
// Marked with `isSample: true` so the card can disable real cart/navigation
// actions. Rendered as an icon tile (not a stock photo) so there's no risk
// of showing an image that doesn't actually match the product.
export const SAMPLE_PRODUCTS = [
  {
    _id: "sample-1",
    productName: "Wireless Over-Ear Headphones",
    price: 2499,
    compareAtPrice: 3499,
    icon: Headphones,
    gradient: "from-neutral-800 to-neutral-950",
    isSample: true,
  },
  {
    _id: "sample-2",
    productName: "Classic Cotton T-Shirt",
    price: 599,
    compareAtPrice: 899,
    icon: Shirt,
    gradient: "from-brand-500 to-brand-700",
    isSample: true,
  },
  {
    _id: "sample-3",
    productName: "Stainless Steel Water Bottle",
    price: 399,
    compareAtPrice: null,
    icon: GlassWater,
    gradient: "from-slate-600 to-slate-800",
    isSample: true,
  },
  {
    _id: "sample-4",
    productName: "Running Shoes — Men",
    price: 1899,
    compareAtPrice: 2599,
    icon: Footprints,
    gradient: "from-brand-600 to-neutral-900",
    isSample: true,
  },
  {
    _id: "sample-5",
    productName: "Smart Fitness Watch",
    price: 3299,
    compareAtPrice: 4999,
    icon: Watch,
    gradient: "from-neutral-700 to-neutral-950",
    isSample: true,
  },
  {
    _id: "sample-6",
    productName: "Ceramic Coffee Mug Set",
    price: 549,
    compareAtPrice: null,
    icon: Coffee,
    gradient: "from-amber-600 to-amber-800",
    isSample: true,
  },
];
