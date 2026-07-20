import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Pencil,
  LogOut,
  ChevronRight,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useProfile, useUpdateProfile } from "./useProfile";
import { useGetOrders } from "../../api/component/useOrder";
import { useGetWishlist } from "../../api/component/useWishlist";

const statusColors = {
  PLACED: "text-blue-700 bg-blue-50",
  CONFIRMED: "text-indigo-700 bg-indigo-50",
  SHIPPED: "text-amber-700 bg-amber-50",
  DELIVERED: "text-emerald-700 bg-emerald-50",
  CANCELLED: "text-red-700 bg-red-50",
  RETURNED: "text-slate-700 bg-slate-100",
};

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.user?.id;

  const { data, isLoading, error } = useProfile(userId);
  const { data: orders = [], isLoading: ordersLoading } = useGetOrders();
  const { data: wishlist = [], isLoading: wishlistLoading } = useGetWishlist();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (data) setForm({ name: data.name || "", phone: data.phone || "" });
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setForm({ name: data?.name || "", phone: data?.phone || "" });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    updateProfile.mutate(
      { userId, name: form.name, phone: form.phone, email: data?.email },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          setIsEditing(false);
        },
        onError: (err) =>
          toast.error(
            err.response?.data?.message || "Failed to update profile"
          ),
      }
    );
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading profile…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  const memberSince = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";
  const orderCount = orders.length;
  const wishlistCount = wishlist.length;
  const addressCount = data?.addresses?.length || 0;
  const initials = (data?.name || data?.email || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header card with cover + avatar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white shadow-md bg-blue-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {initials}
                </div>
                <div className="pb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {data?.name || "Welcome"}
                  </h1>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {data?.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:pb-2">
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <Pencil className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {ordersLoading ? "—" : orderCount}
                  </div>
                  <div className="text-xs text-slate-500">Orders</div>
                </div>
              </button>
              <button
                onClick={() => navigate("/wishlist")}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {wishlistLoading ? "—" : wishlistCount}
                  </div>
                  <div className="text-xs text-slate-500">Wishlist</div>
                </div>
              </button>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {memberSince}
                  </div>
                  <div className="text-xs text-slate-500">Member since</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              Personal Information
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {updateProfile.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow
                  icon={<User className="w-4 h-4" />}
                  label="Name"
                  value={data?.name || "—"}
                />
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={data?.email || "—"}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={data?.phone || "N/A"}
                />
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <ActionRow
                icon={<ShoppingBag className="w-4 h-4" />}
                label="My Orders"
                onClick={() => navigate("/orders")}
              />
              <ActionRow
                icon={<Heart className="w-4 h-4" />}
                label="My Wishlist"
                onClick={() => navigate("/wishlist")}
              />
              <ActionRow
                icon={<MapPin className="w-4 h-4" />}
                label={`Saved Addresses (${addressCount})`}
                onClick={() => navigate("/checkout")}
              />
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Orders
            </h3>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Orders
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {ordersLoading ? (
            <p className="text-center py-8 text-slate-400">Loading orders…</p>
          ) : orders.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {orders.slice(0, 3).map((order) => (
                <li
                  key={order._id}
                  onClick={() => navigate("/orders")}
                  className="py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Order #{order.orderNumber || order._id.slice(-8)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}{" "}
                        · Rs.{order.totalAmount}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                      statusColors[order.orderStatus] ||
                      "text-slate-700 bg-slate-100"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 mb-4">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Start Shopping
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-900">{value}</div>
    </div>
  </div>
);

const ActionRow = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition text-left"
  >
    <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
      <span className="text-slate-400">{icon}</span>
      {label}
    </span>
    <ChevronRight className="w-4 h-4 text-slate-400" />
  </button>
);

export default Profile;
