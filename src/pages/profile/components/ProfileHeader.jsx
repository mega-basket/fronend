import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Calendar, Mail, Pencil, LogOut } from "lucide-react";

const ProfileHeader = ({
  data,
  initials,
  memberSince,
  orderCount,
  ordersLoading,
  wishlistCount,
  wishlistLoading,
  isEditing,
  onEditToggle,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
      <div className="h-32 bg-gradient-to-r from-brand-400 via-brand-600 to-neutral-900 sm:h-40" />
      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-2xl font-bold text-white ring-4 ring-white shadow-md sm:h-28 sm:w-28 sm:text-3xl">
              {initials}
            </div>
            <div className="pb-2">
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                {data?.name || "Welcome"}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-neutral-500">
                <Mail className="h-3.5 w-3.5" />
                {data?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:pb-2">
            <button
              onClick={onEditToggle}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <Pencil className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatTile
            icon={<ShoppingBag className="h-5 w-5" />}
            tone="brand"
            value={ordersLoading ? "—" : orderCount}
            label="Orders"
            onClick={() => navigate("/orders")}
          />
          <StatTile
            icon={<Heart className="h-5 w-5" />}
            tone="rose"
            value={wishlistLoading ? "—" : wishlistCount}
            label="Wishlist"
            onClick={() => navigate("/wishlist")}
          />
          <StatTile
            icon={<Calendar className="h-5 w-5" />}
            tone="emerald"
            value={memberSince}
            label="Member since"
          />
        </div>
      </div>
    </div>
  );
};

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  rose: "bg-rose-50 text-rose-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const StatTile = ({ icon, tone, value, label, onClick }) => {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl bg-neutral-50 p-3 text-left transition ${onClick ? "hover:bg-neutral-100" : ""}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONES[tone]}`}>{icon}</div>
      <div>
        <div className="text-lg font-bold text-neutral-900">{value}</div>
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
    </Tag>
  );
};

export default ProfileHeader;
