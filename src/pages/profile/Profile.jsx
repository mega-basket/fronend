import { useProfile } from "./useProfile";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // assuming stored as JSON
  const userId = user.user._id; // adjust based on your backend
  const { data, isLoading, error } = useProfile(userId);
  console.log(data);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load profile</p>;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center gap-6">
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_xUfgsEggfsK-KqiOJYgPrPSqtRyQzC0fw&s"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-purple-500"
            />
            <div>
              <h2 className="text-2xl font-bold">{data?.userName}</h2>
              <p className="text-gray-300">{data?.email}</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <p>
              <span className="font-semibold">Name:</span> {data?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {data?.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {data?.phone || "N/A"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Edit Profile
            </button>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg mt-3 transition">
              Logout
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Order History</h3>
          {data?.orders && data.orders.length > 0 ? (
            <ul className="space-y-3">
              {data.orders.map((order, index) => (
                <li
                  key={index}
                  className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-300">{order.date}</p>
                  </div>
                  <span className="text-green-400 font-bold">
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
