import { Star } from "lucide-react";

const StarRating = ({ value = 0, count, size = 14, className = "" }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-neutral-200 text-neutral-200"
          }
        />
      ))}
    </div>
    {typeof count === "number" && (
      <span className="text-xs text-neutral-500">({count})</span>
    )}
  </div>
);

export default StarRating;
