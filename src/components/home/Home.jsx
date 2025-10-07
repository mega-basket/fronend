import Hero from "../Hero";
import CategoryGrid from "../CategoryGrid";
import { useGetCategory } from "../../api/component/Category";
import PopulerProduct from "../../pages/popularProduct/PopularProduct";
import { usePopularProducts } from "../../api/component/productApi";

const Home = () => {
  const { data: categories, isLoading, error } = useGetCategory(); // Destructure for clarity
  const { data: popularProducts } = usePopularProducts();
  console.log("popularProducts", popularProducts);

  if (isLoading)
    return <p className="text-center mt-10">Loading categories...</p>;
  if (error)
    return <p className="text-center mt-10">Error loading categories</p>;

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      <div className="mx-auto max-w-7xl">
        <CategoryGrid categories={categories} />
        <PopulerProduct popularProducts={popularProducts} />
      </div>
    </div>
  );
};

export default Home;
