import { PackageSearch, SearchX } from "lucide-react";

const VARIANT_ICONS = {
  cart: PackageSearch,
  search: SearchX,
};

/**
 * EmptyState
 * ----------
 * Generic "nothing here" panel used by listing pages. Matches the
 * neutral-900 / rounded-2xl visual language used across the category
 * and product-detail pages.
 */
export const EmptyState = ({ variant = "search", title, subtitle, action }) => {
  const Icon = VARIANT_ICONS[variant] || SearchX;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <Icon size={24} className="text-neutral-400" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-neutral-900">{title}</h2>
      {subtitle && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{subtitle}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
