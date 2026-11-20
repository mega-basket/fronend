import { useEffect, useState } from "react";
import { ChevronDown, Star } from "lucide-react";

/**
 * FilterSidebar
 * -------------
 * Controlled component. Parent owns filter state; this just renders and reports changes.
 *
 * Props:
 *   filters             { brands: [], minPrice, maxPrice, minRating, minDiscount, inStock }
 *   onChange(nextFilters)
 *   availableBrands     [{ name, count }]  // from response facets
 *   priceRange          { min, max }
 *   onClear()
 */
const FilterSidebar = ({
  filters,
  onChange,
  availableBrands = [],
  priceRange = { min: 0, max: 200000 },
  onClear,
}) => {
  const patch = (partial) => onChange({ ...filters, ...partial });

  const toggleBrand = (name) => {
    const current = filters.brands || [];
    patch({
      brands: current.includes(name)
        ? current.filter((b) => b !== name)
        : [...current, name],
    });
  };

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-sm font-medium text-neutral-900">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
        >
          Clear all
        </button>
      </div>

      <Section title="Price">
        <PriceRange
          min={priceRange.min}
          max={priceRange.max}
          value={{ min: filters.minPrice, max: filters.maxPrice }}
          onChange={({ min, max }) =>
            patch({ minPrice: min, maxPrice: max })
          }
        />
      </Section>

      {availableBrands.length > 0 && (
        <Section title="Brand">
          <BrandList
            brands={availableBrands}
            selected={filters.brands || []}
            onToggle={toggleBrand}
          />
        </Section>
      )}

      <Section title="Rating">
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => patch({ minRating: r })}
                className="h-4 w-4 accent-neutral-900"
              />
              <span className="inline-flex items-center gap-1 text-neutral-700">
                {r}
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-neutral-500">& above</span>
              </span>
            </label>
          ))}
          {filters.minRating && (
            <button
              type="button"
              onClick={() => patch({ minRating: undefined })}
              className="ml-2 text-xs text-neutral-500 hover:text-neutral-900"
            >
              Clear
            </button>
          )}
        </div>
      </Section>

      <Section title="Discount">
        <div className="space-y-1">
          {[10, 25, 50].map((d) => (
            <label
              key={d}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50"
            >
              <input
                type="radio"
                name="discount"
                checked={filters.minDiscount === d}
                onChange={() => patch({ minDiscount: d })}
                className="h-4 w-4 accent-neutral-900"
              />
              <span className="text-neutral-700">{d}% or more</span>
            </label>
          ))}
          {filters.minDiscount && (
            <button
              type="button"
              onClick={() => patch({ minDiscount: undefined })}
              className="ml-2 text-xs text-neutral-500 hover:text-neutral-900"
            >
              Clear
            </button>
          )}
        </div>
      </Section>

      <Section title="Availability" defaultOpen={false}>
        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={(e) => patch({ inStock: e.target.checked || undefined })}
            className="h-4 w-4 rounded accent-neutral-900"
          />
          <span className="text-neutral-700">In stock only</span>
        </label>
      </Section>
    </aside>
  );
};

/* ------------------------------ Section --------------------------------- */

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-neutral-100 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        <ChevronDown
          size={16}
          className={`text-neutral-500 transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

/* --------------------------- Price with debounce ------------------------ */

const PriceRange = ({ min, max, value, onChange }) => {
  const [local, setLocal] = useState({
    min: value.min ?? "",
    max: value.max ?? "",
  });

  // Sync down when the parent resets filters externally
  useEffect(() => {
    setLocal({ min: value.min ?? "", max: value.max ?? "" });
  }, [value.min, value.max]);

  // Debounce commit upward
  useEffect(() => {
    const id = setTimeout(() => {
      const nextMin = local.min === "" ? undefined : Number(local.min);
      const nextMax = local.max === "" ? undefined : Number(local.max);
      if (nextMin !== value.min || nextMax !== value.max) {
        onChange({ min: nextMin, max: nextMax });
      }
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.min, local.max]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <NumberInput
          label="Min"
          placeholder={`₹${min.toLocaleString("en-IN")}`}
          value={local.min}
          onChange={(v) => setLocal((s) => ({ ...s, min: v }))}
        />
        <span className="text-neutral-400">–</span>
        <NumberInput
          label="Max"
          placeholder={`₹${max.toLocaleString("en-IN")}`}
          value={local.max}
          onChange={(v) => setLocal((s) => ({ ...s, max: v }))}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[
          [undefined, 1000],
          [1000, 5000],
          [5000, 25000],
          [25000, undefined],
        ].map(([lo, hi], i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLocal({ min: lo ?? "", max: hi ?? "" })}
            className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[11px] text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
          >
            {lo && hi
              ? `₹${lo / 1000}k–${hi / 1000}k`
              : hi
              ? `Under ₹${hi / 1000}k`
              : `Over ₹${lo / 1000}k`}
          </button>
        ))}
      </div>
    </div>
  );
};

const NumberInput = ({ label, value, onChange, placeholder }) => (
  <label className="flex-1">
    <span className="sr-only">{label}</span>
    <input
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder={placeholder}
      className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
    />
  </label>
);

/* --------------------------- Searchable brand list ---------------------- */

const BrandList = ({ brands, selected, onToggle }) => {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div>
      {brands.length > 8 && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands"
          className="mb-2 w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />
      )}
      <ul className="space-y-0.5">
        {visible.map((b) => (
          <li key={b.name}>
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50">
              <input
                type="checkbox"
                checked={selected.includes(b.name)}
                onChange={() => onToggle(b.name)}
                className="h-4 w-4 rounded accent-neutral-900"
              />
              <span className="flex-1 text-neutral-700">{b.name}</span>
              {b.count != null && (
                <span className="text-xs text-neutral-400 tabular-nums">
                  {b.count}
                </span>
              )}
            </label>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-2 py-1.5 text-xs text-neutral-500">No brands found</li>
        )}
      </ul>
      {filtered.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 px-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
        >
          {showAll ? "Show less" : `Show ${filtered.length - 6} more`}
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;