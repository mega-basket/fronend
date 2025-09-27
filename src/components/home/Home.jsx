import Hero from "../Hero";
import CategoryGrid from "../CategoryGrid";
import { useGetCategory } from "../../api/component/Category";

const Home = () => {
  const { data: categories, isLoading, error } = useGetCategory(); // Destructure for clarity

  if (isLoading)
    return <p className="text-center mt-10">Loading categories...</p>;
  if (error)
    return <p className="text-center mt-10">Error loading categories</p>;

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      <CategoryGrid categories={categories} />
    </div>
  );
};

export default Home;
