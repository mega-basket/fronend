import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, MapPin, ChevronRight } from "lucide-react";

const QuickActionsCard = ({ addressCount }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
      <h3 className="mb-4 text-base font-semibold text-neutral-900">Quick Actions</h3>
      <div className="space-y-2">
        <ActionRow icon={<ShoppingBag className="h-4 w-4" />} label="My Orders" onClick={() => navigate("/orders")} />
        <ActionRow icon={<Heart className="h-4 w-4" />} label="My Wishlist" onClick={() => navigate("/wishlist")} />
        <ActionRow
          icon={<MapPin className="h-4 w-4" />}
          label={`Saved Addresses (${addressCount})`}
          onClick={() => navigate("/checkout")}
        />
      </div>
    </div>
  );
};

const ActionRow = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-neutral-50"
  >
    <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-700">
      <span className="text-neutral-400">{icon}</span>
      {label}
    </span>
    <ChevronRight className="h-4 w-4 text-neutral-400" />
  </button>
);

export default QuickActionsCard;
