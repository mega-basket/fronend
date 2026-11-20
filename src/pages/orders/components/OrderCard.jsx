import OrderTimeline from "../../../components/OrderTimeline";
import Badge from "../../../components/ui/Badge";
import { formatInr } from "../../../components/ui/formatInr";
import { imgProps } from "../../../utils/image";
import OrderActions from "./OrderActions";

const STATUS_TONE = {
  PLACED: "brand",
  CONFIRMED: "brand",
  SHIPPED: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  RETURNED: "neutral",
};

const OrderCard = ({ order }) => (
  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-neutral-600">
        <span>
          Order <span className="font-semibold text-neutral-900">{order.orderNumber || order._id.slice(-8)}</span>
        </span>
        <span>
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span>
          {order.paymentMethod} ·{" "}
          <span className={order.paymentStatus === "PAID" ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
            {order.paymentStatus}
          </span>
        </span>
      </div>
      <Badge tone={STATUS_TONE[order.orderStatus] || "neutral"}>{order.orderStatus}</Badge>
    </div>
    <OrderTimeline order={order} />
    <div className="flex flex-col gap-3 px-5 py-4">
      {order.items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
          {item.thumbnail && (
            <img {...imgProps(item.thumbnail, 56)} alt={item.productName} className="h-14 w-14 rounded-lg border border-neutral-100 object-cover" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">{item.productName}</p>
            <p className="text-sm text-neutral-500">
              {item.color && <>Color: {item.color} · </>}Qty: {item.quantity}
            </p>
          </div>
          <p className="font-semibold text-neutral-900">{formatInr(item.totalPrice)}</p>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3 text-sm">
      <span className="text-neutral-500">
        Deliver to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
      </span>
      <span className="text-base font-bold text-neutral-900">Total: {formatInr(order.totalAmount)}</span>
    </div>

    <OrderActions order={order} />
  </div>
);

export default OrderCard;
