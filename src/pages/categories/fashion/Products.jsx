import { useLocation } from "react-router-dom";
import { useProductsByCategory } from "../../../api/component/productApi";
import ProductsCard from "./components/ProductsCard";

const Products = () => {
  const location = useLocation();

  // ✅ get categoryId from query string
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");
  window.scrollTo(0, 0);

  const { data, isLoading, error } = useProductsByCategory(categoryId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-center mx-auto mt-10 mx-auto justify-center max-w-7xl">
      {data?.map((item) => (
        <div key={item._id}>
          <ProductsCard items={item} />
        </div>
      ))}
    </div>
  );
};

export default Products;
