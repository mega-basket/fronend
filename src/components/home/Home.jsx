import Hero from "./Hero";
import CategoryGrid from "./CategoryGrid";
import PromoBanner from "./PromoBanner";
import WhyShopWithUs from "./WhyShopWithUs";
import PopularProducts from "./PopularProducts";
import RecentlyViewed from "./RecentlyViewed";
import { useGetCategory } from "../../api/component/Category";
import { usePopularProducts } from "../../api/component/productApi";
import { PageError } from "../ui/Spinner";

const Home = () => {
  const { data: categories, isLoading: categoriesLoading, error } = useGetCategory();
  const { data: popularProducts, isLoading: productsLoading } = usePopularProducts();

  if (error) return <PageError label="Couldn't load categories. Please try again." />;

  return (
    <div>
      <Hero categories={categories || []} />
      <div className="mx-auto max-w-7xl">
        <RecentlyViewed />
        <CategoryGrid categories={categories} isLoading={categoriesLoading} />
        <PromoBanner />
        <WhyShopWithUs />
        <PopularProducts popularProducts={popularProducts} isLoading={productsLoading} />
      </div>
    </div>
  );
};

export default Home;
