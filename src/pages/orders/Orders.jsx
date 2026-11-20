import { useGetOrders } from "../../api/component/useOrder";
import EmptyState from "../../components/ui/EmptyState";
import { PageError } from "../../components/ui/Spinner";
import { OrdersSkeleton } from "../../components/ui/Skeleton";
import OrderCard from "./components/OrderCard";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, error } = useGetOrders();

  if (isLoading) return <OrdersSkeleton />;
  if (error) return <PageError label="Failed to load orders." />;

  if (orders.length === 0)
    return (
      <EmptyState
        icon={<Package size={28} />}
        title="No orders yet"
        description="Once you place an order, you'll be able to track it here."
        actionLabel="Start shopping"
        onAction={() => navigate("/products")}
      />
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">My Orders</h1>
      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
