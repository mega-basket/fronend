import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAddToCart, useGetToCart } from "../../api/component/Cart";
import { useIsLoggedIn } from "../../hooks/useAuth";
import AuthPromptModal from "../ui/AuthPromptModal";
import SectionHeading from "../ui/SectionHeading";
import PriceTag from "../ui/PriceTag";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { SAMPLE_PRODUCTS } from "./sampleProducts";
import { imgProps } from "../../utils/image";

const PopularProducts = ({ popularProducts, isLoading }) => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const { data: cartData = [] } = useGetToCart();
  const addToCart = useAddToCart();

  // Nothing from the backend yet — show sample cards so the section's full
  // UI is still visible instead of disappearing entirely.
  const usingSamples = !isLoading && !popularProducts?.length;
  const items = usingSamples ? SAMPLE_PRODUCTS : popularProducts;

  const handleCardClick = (product) => {
    if (product.isSample) {
      toast("This is a sample product — real items will appear here once added.", { icon: "ℹ️" });
      return;
    }
    navigate(`/products/${product.slug}`);
  };

  const handleAddToCart = (product) => {
    if (product.isSample) {
      toast("This is a sample product and can't be added to cart.", { icon: "ℹ️" });
      return;
    }
    if (!isLoggedIn) return setAuthModalOpen(true);

    const isInCart = cartData?.some((item) => item.product?._id === product._id);

    addToCart.mutate(
      { productId: product._id },
      {
        onSuccess: () => toast.success(isInCart ? "Already in cart" : "Added to cart"),
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to add to cart"),
      }
    );
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="px-4 py-8 md:py-12">
      <SectionHeading title="Popular Products" seeAllTo="/products" />
      {usingSamples && (
        <p className="mt-1 text-xs text-neutral-400">
          Showing sample products — real popular items will appear here once available.
        </p>
      )}

      <div className="mt-6 flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 w-[200px] flex-none animate-pulse rounded-2xl bg-neutral-100 sm:w-[220px]" />
          ))}

        {!isLoading &&
          items.map((prod) => (
            <div
              key={prod._id}
              className="relative w-[200px] flex-none overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-card transition hover:shadow-card-hover sm:w-[220px]"
            >
              {prod.isSample && (
                <Badge tone="neutral" className="absolute left-2.5 top-2.5 z-10">
                  Sample
                </Badge>
              )}
              <button onClick={() => handleCardClick(prod)} className="block w-full">
                {prod.isSample ? (
                  <div
                    className={`flex h-44 w-full items-center justify-center bg-gradient-to-br ${prod.gradient}`}
                  >
                    <prod.icon size={48} className="text-white/90" strokeWidth={1.5} />
                  </div>
                ) : (
                  <img
                    {...imgProps(prod.thumbnail, 220)}
                    alt={prod.productName}
                    className="h-44 w-full object-cover"
                  />
                )}
              </button>
              <div className="p-3.5">
                <button
                  onClick={() => handleCardClick(prod)}
                  className="line-clamp-2 text-left text-sm font-medium text-neutral-800 hover:text-brand-600"
                >
                  {prod.productName}
                </button>
                <PriceTag
                  price={prod.price}
                  compareAtPrice={prod.compareAtPrice}
                  size="sm"
                  className="mt-1.5"
                />
                <Button
                  size="sm"
                  fullWidth
                  className="mt-3"
                  onClick={() => handleAddToCart(prod)}
                  loading={!prod.isSample && addToCart.isPending}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
      </div>

      <AuthPromptModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </section>
  );
};

export default PopularProducts;
