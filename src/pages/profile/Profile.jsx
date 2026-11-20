import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProfile, useUpdateProfile } from "./useProfile";
import { useGetOrders } from "../../api/component/useOrder";
import { useGetWishlist } from "../../api/component/useWishlist";
import { PageError } from "../../components/ui/Spinner";
import { ProfileSkeleton } from "../../components/ui/Skeleton";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoCard from "./components/PersonalInfoCard";
import QuickActionsCard from "./components/QuickActionsCard";
import RecentOrdersCard from "./components/RecentOrdersCard";

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
    if (!isEditing) setForm({ name: data?.name || "", phone: data?.phone || "" });
    setIsEditing((v) => !v);
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
        onError: (err) => toast.error(err.response?.data?.message || "Failed to update profile"),
      }
    );
  };

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-neutral-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (isLoading) return <ProfileSkeleton />;
  if (error || !data) return <PageError label="Failed to load profile." />;

  const memberSince = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";
  const addressCount = data?.addresses?.length || 0;
  const initials = (data?.name || data?.email || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <ProfileHeader
          data={data}
          initials={initials}
          memberSince={memberSince}
          orderCount={orders.length}
          ordersLoading={ordersLoading}
          wishlistCount={wishlist.length}
          wishlistLoading={wishlistLoading}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onLogout={handleLogout}
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <PersonalInfoCard
            isEditing={isEditing}
            form={form}
            onFormChange={setForm}
            onSave={handleSave}
            saving={updateProfile.isPending}
            data={data}
          />
          <QuickActionsCard addressCount={addressCount} />
        </div>

        <div className="mt-6">
          <RecentOrdersCard orders={orders} loading={ordersLoading} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
