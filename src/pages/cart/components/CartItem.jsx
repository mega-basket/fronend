import { Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatInr } from "../../../components/ui/formatInr";
import { imgProps } from "../../../utils/image";

const CartItem = ({
  item,
  onQuantityChange,
  onVariantChange,
  onRemove,
  quantityPending,
  variantPending,
}) => {
  const navigate = useNavigate();
  const goToProduct = () => navigate(`/products/${item.product?.slug}`);
  const inStock = (item.variant?.stockQuantity ?? 0) > 0;

  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card transition hover:shadow-card-hover">
      <img
        {...imgProps(item.variant?.thumbnail, 112)}
        alt={item.product?.productName}
        onClick={goToProduct}
        className="h-28 w-28 shrink-0 cursor-pointer rounded-xl border border-neutral-100 object-cover"
      />

      <div className="flex-1">
        <h2
          className="cursor-pointer text-base font-semibold text-neutral-900 hover:text-brand-600"
          onClick={goToProduct}
        >
          {item.product?.productName}
        </h2>
        {item.product?.brand && (
          <p className="mt-0.5 text-sm text-neutral-500">
            Brand: {item.product.brand}
          </p>
        )}

        {item.product?.variants?.length > 1 ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-neutral-500">Color:</span>
            {item.product.variants.map((v) => (
              <button
                key={v._id}
                type="button"
                title={
                  v.stockQuantity > 0
                    ? v.color?.name
                    : `${v.color?.name} (Out of stock)`
                }
                disabled={v.stockQuantity < 1 || variantPending}
                onClick={() => onVariantChange(item, v._id)}
                className={`h-6 w-6 rounded-full border-2 transition ${
                  item.variant?._id === v._id
                    ? "border-neutral-900 ring-2 ring-neutral-200 scale-110"
                    : "border-neutral-300 hover:border-neutral-500"
                } disabled:cursor-not-allowed disabled:opacity-30`}
                style={{ backgroundColor: v.color?.name?.toLowerCase() || "gray" }}
              />
            ))}
            <span className="text-sm text-neutral-500">{item.variant?.color?.name}</span>
          </div>
        ) : (
          item.variant?.color?.name && (
            <p className="mt-0.5 text-sm text-neutral-500">
              Color: {item.variant.color.name}
            </p>
          )
        )}

        <p className="mt-1.5 font-semibold text-neutral-900">
          {formatInr(item.priceAtAdd)}
        </p>
        <p className={`mt-0.5 text-sm font-medium ${inStock ? "text-emerald-600" : "text-rose-600"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(item, item.quantity - 1)}
            disabled={item.quantity <= 1 || quantityPending}
            className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold text-neutral-900">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item, item.quantity + 1)}
            disabled={quantityPending}
            className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item)}
          className="rounded-full p-2 text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
          title="Remove from cart"
        >
          <Trash2 size={20} />
        </button>
        <p className="font-bold text-neutral-900">{formatInr(item.subtotal)}</p>
      </div>
    </div>
  );
};

export default CartItem;
