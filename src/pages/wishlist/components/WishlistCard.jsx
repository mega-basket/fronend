import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import StarRating from "../../../components/ui/StarRating";
import PriceTag from "../../../components/ui/PriceTag";
import { imgProps } from "../../../utils/image";

const WishlistCard = ({ item, onRemove, removing }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card transition hover:shadow-card-hover">
      <button
        onClick={() => navigate(`/products/${item.slug}`)}
        className="shrink-0 overflow-hidden rounded-xl border border-neutral-100"
      >
        <img
          {...imgProps(item.variants?.[0]?.thumbnail, 96)}
          alt={item.productName}
          className="h-24 w-24 object-cover"
        />
      </button>

      <div className="min-w-0 flex-1">
        <button
          onClick={() => navigate(`/products/${item.slug}`)}
          className="line-clamp-2 text-left font-semibold text-neutral-900 hover:text-brand-600"
        >
          {item.productName}
        </button>
        {item.brand && <p className="text-sm text-neutral-500">{item.brand}</p>}
        <StarRating value={item.avgRating} count={item.totalReviews} className="mt-1" />
        <PriceTag price={item.discountPrice || item.price} compareAtPrice={item.discountPrice ? item.price : undefined} className="mt-1.5" />
      </div>

      <button
        onClick={() => onRemove(item._id)}
        disabled={removing}
        aria-label="Remove from wishlist"
        className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-rose-500 opacity-0 shadow-card transition group-hover:opacity-100 hover:bg-rose-50 disabled:opacity-40 sm:opacity-100"
      >
        <Heart size={16} className="fill-current" />
      </button>
    </div>
  );
};

export default WishlistCard;
