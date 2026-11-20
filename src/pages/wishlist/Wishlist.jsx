import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetWishlist,
  useRemoveFromWishlist,
} from "../../api/component/useWishlist";
import WishlistImg from "../../assets/empty-wishlist.png";
import EmptyState from "../../components/ui/EmptyState";
import { PageError } from "../../components/ui/Spinner";
import { WishlistSkeleton } from "../../components/ui/Skeleton";
import WishlistCard from "./components/WishlistCard";

const Wishlist = () => {
  const navigate = useNavigate();
  const { data: wishlist, isLoading, error } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (productId) => {
    removeFromWishlist.mutate(
      { productId },
      { onError: () => toast.error("Couldn't remove item — please try again") }
    );
  };

  if (isLoading) return <WishlistSkeleton />;
  if (error) return <PageError label="Failed to load wishlist." />;

  if (!wishlist || wishlist.length === 0) {
    return (
      <EmptyState
        image={WishlistImg}
        title="Your wishlist is empty"
        description="Save your favorite products here so you can easily find and purchase them later."
        actionLabel="Explore Products"
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <WishlistCard
            key={item._id}
            item={item}
            onRemove={handleRemove}
            removing={removeFromWishlist.isPending}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
