import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, Package } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { formatInr } from "../../../components/ui/formatInr";

const STATUS_TONE = {
  PLACED: "brand",
  CONFIRMED: "brand",
  SHIPPED: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  RETURNED: "neutral",
};

const RecentOrdersCard = ({ orders, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900">Recent Orders</h3>
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View All Orders
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-neutral-400">Loading orders…</p>
      ) : orders.length > 0 ? (
        <ul className="divide-y divide-neutral-100">
          {orders.slice(0, 3).map((order) => (
            <li
              key={order._id}
              onClick={() => navigate("/orders")}
              className="-mx-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-3 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    Order #{order.orderNumber || order._id.slice(-8)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {formatInr(order.totalAmount)}
                  </p>
                </div>
              </div>
              <Badge tone={STATUS_TONE[order.orderStatus] || "neutral"}>{order.orderStatus}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="mb-4 text-neutral-500">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Start Shopping
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersCard;
