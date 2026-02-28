import { useEffect, useState } from "react";

export default function Profile() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, []);

  return (
    <div className="flex-1 p-10 text-white">
      <h1 className="text-3xl font-semibold mb-2">Profile</h1>
      <p className="text-slate-400 mb-8">
        Manage your account information.
      </p>

      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Account Status
            </label>
            <input
              value="Active"
              disabled
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-green-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-2">Security</h2>
        <p className="text-slate-400 mb-4">
          Password management will be available soon.
        </p>

        <button
          disabled
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-500 cursor-not-allowed"
        >
          Change Password (Coming Soon)
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-red-900 rounded-xl p-6 max-w-xl">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-slate-400 mb-4">
          Account deletion will be enabled after backend integration.
        </p>

        <button
          disabled
          className="px-4 py-2 rounded-lg bg-red-900/40 text-red-400 cursor-not-allowed"
        >
          Delete Account (Disabled)
        </button>
      </div>
    </div>
  );
}
