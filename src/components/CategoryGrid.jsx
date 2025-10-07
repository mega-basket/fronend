import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryGrid = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <section id="categories" className=" px-4 py-12 md:py-16">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Shop by Category
        </h2>
        <a
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
          href="#"
        >
          See all
        </a>
      </div>

      {/* Categories Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories?.map((cat) => (
          <div
            key={cat._id}
            className="group relative overflow-hidden rounded-2xl glass soft-shadow hover:-translate-y-0.5 transition cursor-pointer"
            onClick={() => navigate(`/products?categoryId=${cat._id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
            <img
              src={cat.categoryImage} // ✅ fixed
              alt={cat.categoryName}
              className="h-36 w-full object-cover hover:scale-105 transition"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-center justify-between">
                <p className="text-white font-bold">{cat.categoryName}</p>
                <div className="text-white/90 group-hover:translate-x-0.5 transition">
                  →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
