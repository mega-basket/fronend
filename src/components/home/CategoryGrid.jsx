import { useNavigate } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import { imgProps } from "../../utils/image";

const CategoryGrid = ({ categories, isLoading }) => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="px-4 py-12 md:py-16">
      <SectionHeading title="Shop by Category" seeAllTo="/categories" />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}

        {categories?.map((cat) => (
          <button
            key={cat._id}
            onClick={() => navigate(`/products?categoryId=${cat._id}`)}
            className="group relative overflow-hidden rounded-2xl text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <img
              {...imgProps(cat.categoryImage, 360)}
              alt={cat.categoryName}
              className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
              <p className="font-semibold text-white">{cat.categoryName}</p>
              <span className="text-white/90 transition group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
