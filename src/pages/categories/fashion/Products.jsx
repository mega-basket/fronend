import { useLocation, useNavigate } from "react-router-dom";
import { useProductsByCategory } from "../../../api/component/productApi";
import ProductsCard from "./components/ProductsCard";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ get categoryId from query string
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");

  const { data, isLoading, error } = useProductsByCategory(categoryId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 mx-10">
      {data?.map((item) => (
        <div key={item._id} onClick={() => navigate(`/products/${item._id}`)}>
          <ProductsCard items={item} />
        </div>
      ))}
    </div>
  );
};

export default Products;
