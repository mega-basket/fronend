import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useCategoryProducts } from "../../api/component/productApi";
import { useGetCategory } from "../../api/component/Category";
import ProductCard from "./components/ProductCard";
import FilterSidebar from "./components/FilterSidebar";
import EmptyState from "./components/EmptyState";
import Button from "../../components/ui/Button";

const PAGE_SIZE = 24;

const emptyFilters = {
  brands: [],
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  minDiscount: undefined,
  inStock: undefined,
};

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

// Filter state lives in the URL (?brands=a,b&minPrice=500&sort=price-asc&page=2)
// so results survive a refresh, work with Back/Forward and can be shared.
const FILTER_PARAMS = {
  brands: "brands",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  minRating: "rating",
  minDiscount: "discount",
  inStock: "inStock",
};

const toNumber = (v) => (v == null || v === "" || Number.isNaN(Number(v)) ? undefined : Number(v));

const readFilters = (params) => ({
  brands: params.get(FILTER_PARAMS.brands)?.split(",").filter(Boolean) || [],
  minPrice: toNumber(params.get(FILTER_PARAMS.minPrice)),
  maxPrice: toNumber(params.get(FILTER_PARAMS.maxPrice)),
  minRating: toNumber(params.get(FILTER_PARAMS.minRating)),
  minDiscount: toNumber(params.get(FILTER_PARAMS.minDiscount)),
  inStock: params.get(FILTER_PARAMS.inStock) === "1" || undefined,
});

const getPrice = (p) => p.discountPrice || p.price || 0;
const getRating = (p) => p.avgRating ?? p.rating ?? 0;
const getDiscount = (p) =>
  p.price ? Math.round(((p.price - (p.discountPrice || p.price)) / p.price) * 100) : 0;

const SORTERS = {
  "price-asc": (a, b) => getPrice(a) - getPrice(b),
  "price-desc": (a, b) => getPrice(b) - getPrice(a),
  rating: (a, b) => getRating(b) - getRating(a),
  discount: (a, b) => getDiscount(b) - getDiscount(a),
};

const Products = () => {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get("categoryId") || undefined;
  const query = params.get("q") || params.get("search") || "";
  const page = Math.max(toNumber(params.get("page")) || 1, 1);
  const sort = SORTERS[params.get("sort")] ? params.get("sort") : "";
  const filters = useMemo(() => readFilters(params), [params]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Write changes into the URL. Filter tweaks replace the history entry (no
  // Back-button spam while dragging a price); page changes push a new one.
  const updateParams = (mutate, { push = false } = {}) => {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next, { replace: !push });
  };

  const setFilters = (nextFilters) =>
    updateParams((next) => {
      Object.entries(FILTER_PARAMS).forEach(([key, param]) => {
        const value = nextFilters[key];
        const empty = value == null || value === false || (Array.isArray(value) && value.length === 0);
        if (empty) next.delete(param);
        else if (Array.isArray(value)) next.set(param, value.join(","));
        else if (value === true) next.set(param, "1");
        else next.set(param, String(value));
      });
      next.delete("page");
    });

  const clearFilters = () => setFilters(emptyFilters);

  const setSort = (value) =>
    updateParams((next) => {
      if (value) next.set("sort", value);
      else next.delete("sort");
      next.delete("page");
    });

  const setPage = (nextPage) => {
    updateParams(
      (next) => {
        if (nextPage > 1) next.set("page", String(nextPage));
        else next.delete("page");
      },
      { push: true }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: categories = [] } = useGetCategory();
  const activeCategory = categories.find((c) => c._id === categoryId);

  const { data, isLoading, isError } = useCategoryProducts({
    categoryId,
    q: query,
    page,
    limit: PAGE_SIZE,
  });

  const products = useMemo(() => data?.products || [], [data]);
  const totalPages = data?.totalPages || 1;

  // Backend doesn't support brand/price/rating/discount filtering or sorting
  // yet — apply it client-side over the current page's results.
  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      const price = getPrice(p);
      if (filters.minPrice != null && price < filters.minPrice) return false;
      if (filters.maxPrice != null && price > filters.maxPrice) return false;
      if (filters.minRating && getRating(p) < filters.minRating) return false;
      if (filters.minDiscount && getDiscount(p) < filters.minDiscount) return false;
      if (filters.inStock && !p.variants?.some((v) => v.stockQuantity > 0)) return false;
      return true;
    });
    return sort ? [...list].sort(SORTERS[sort]) : list;
  }, [products, filters, sort]);

  const availableBrands = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => {
      if (!p.brand) return;
      counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
    });
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [products]);

  const activeFilterCount =
    filters.brands.length +
    (filters.minPrice != null ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.minDiscount ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const clearSearch = () =>
    updateParams((next) => {
      next.delete("q");
      next.delete("search");
      next.delete("page");
    });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {query ? `Results for “${query}”` : activeCategory?.categoryName || "All Products"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isLoading ? "Loading…" : `${data?.total ?? filtered.length} products`}
          </p>
        </div>

        {query && (
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <X size={12} />
            Clear search
          </button>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="product-sort" className="sr-only">
            Sort products
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 focus:border-neutral-900 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-700 lg:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden w-60 shrink-0 lg:block">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            availableBrands={availableBrands}
          />
        </div>

        {/* Grid */}
        <div className="flex-1">
          {isError && (
            <EmptyState
              variant="search"
              title="Something went wrong"
              subtitle="We couldn't load these products. Please try again."
            />
          )}

          {isLoading && <ProductGridSkeleton />}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              variant="search"
              title="No products found"
              subtitle={
                activeFilterCount > 0
                  ? "Try removing a few filters to see more results."
                  : "Try a different search term or browse another category."
              }
              action={
                activeFilterCount > 0 ? (
                  <Button variant="outline" size="sm" className="mt-5" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : null
              }
            />
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <ProductCard key={item._id} items={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-3 text-sm text-neutral-500">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-neutral-900/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <aside className="absolute inset-y-0 right-0 w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
              availableBrands={availableBrands}
            />
            <Button fullWidth className="mt-4" onClick={() => setMobileFiltersOpen(false)}>
              Show {filtered.length} results
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
};

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200/80">
        <div className="aspect-square animate-pulse bg-neutral-100" />
        <div className="space-y-2 p-4">
          <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    ))}
  </div>
);

export default Products;
