import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useGetOrders } from "../../api/component/useOrder";

const statusColors = {
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-gray-200 text-gray-700",
};

const Orders = () => {
  const { data: orders = [], isLoading, error } = useGetOrders();

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;
  if (error)
    return <p className="text-center mt-10">Failed to load orders.</p>;

  if (orders.length === 0)
    return (
      <div className="text-center mt-20">
        <Package size={56} className="mx-auto text-gray-300" />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          No orders yet
        </p>
        <Link
          to="/"
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          Start shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border-b px-5 py-3 text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600">
                <span>
                  Order{" "}
                  <span className="font-semibold text-gray-900">
                    {order.orderNumber || order._id.slice(-8)}
                  </span>
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
                  <span
                    className={
                      order.paymentStatus === "PAID"
                        ? "text-green-600 font-medium"
                        : "text-amber-600 font-medium"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Items */}
            <div className="px-5 py-4 flex flex-col gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.color && <>Color: {item.color} · </>}Qty:{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">Rs.{item.totalPrice}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-5 py-3 text-sm">
              <span className="text-gray-500">
                Deliver to: {order.shippingAddress?.fullName},{" "}
                {order.shippingAddress?.city}
              </span>
              <span className="font-bold text-base">
                Total: Rs.{order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
