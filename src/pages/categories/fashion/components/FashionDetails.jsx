import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FashionCard from "./FashionCard";
import { Heart } from "lucide-react";
import { useGetProductById } from "../../../../api/component/productApi";

const FashionDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductById(id);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (product?.thumbnail) {
      setMainImage(product.thumbnail); // Set initial main image
    }
  }, [product]);

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center mt-10">Error loading product</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  // Make sure main image is part of thumbnails
  const allImages = [product.thumbnail, ...(product.images || [])];

  return (
    <div className="m-4 flex flex-col gap-10">
      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Images */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="lg:flex flex-col gap-2">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`img ${i}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer hover:scale-105 transition
                  ${mainImage === img ? "border-2 border-blue-600" : ""}
                `}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full max-w-md object-cover rounded"
          />
        </div>

        {/* Product Details */}
        <div className="bg-gray-100/50 p-6 rounded-md flex-1 flex flex-col gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
          <p className="font-semibold">
            Price: <span className="font-bold">Rs.{product.price}</span>
          </p>
          <p className="font-semibold">
            Discount: <span className="font-bold">{product.discount}</span>
          </p>
          <p className="font-semibold">Description: {product.description}</p>

          <p className="font-semibold">Shipping: Rs.{product.shippingCharge}</p>
          <p className="font-semibold">Return Policy: {product.returnPolicy}</p>
          <p className="font-semibold">Delivery: {product.deliveryDate}</p>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Quantity:</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="border p-2 rounded w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
              Buy It Now
            </button>
            <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Heart /> Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDetails;
