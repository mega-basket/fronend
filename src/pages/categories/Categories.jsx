import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useGetCategory } from "../../api/component/Category";
import { imgProps } from "../../utils/image";

/**
 * CategoriesPage
 * ---------------
 * Displays all available product categories in a grid.
 * Users click a category to browse its products.
 */
const CategoriesPage = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading, isError } = useGetCategory();

  const goToCategory = (categoryId) => {
    navigate(`/products?categoryId=${categoryId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Shop by Category
        </h1>
        <p className="mt-2 text-neutral-500">
          Explore our curated collections
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">
            Something went wrong loading categories.
          </p>
          <p className="mt-1 text-xs text-rose-600">Please try again.</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <GridSkeleton />}

      {/* Empty state */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl">📁</span>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-neutral-900">
            No categories available
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
            Check back soon — categories are being added.
          </p>
        </div>
      )}

      {/* Categories grid */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => goToCategory(category._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * CategoryCard
 * Individual category tile with image, name, description.
 */
const CategoryCard = ({ category, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-neutral-100">
        {category.categoryImage ? (
          <img
            {...imgProps(category.categoryImage, 400)}
            alt={category.categoryName}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-neutral-100 text-4xl">
            📦
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold tracking-tight text-neutral-900">
          {category.categoryName}
        </h3>
        {category.description && (
          <p className="text-xs text-neutral-500 leading-relaxed">
            {category.description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-neutral-600 transition-colors group-hover:text-neutral-900">
          Browse
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
};

/**
 * GridSkeleton
 * Loading skeleton for category grid.
 */
const GridSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white"
      >
        <div className="aspect-video animate-pulse bg-neutral-100" />
        <div className="flex-1 space-y-2 p-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    ))}
  </div>
);

export default CategoriesPage;
