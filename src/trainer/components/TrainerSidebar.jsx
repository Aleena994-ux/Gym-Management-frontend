import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaUsers, FaDumbbell, FaRunning } from "react-icons/fa";
import { toast } from "react-toastify";

export default function TrainerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("existingUser");
    sessionStorage.removeItem("token");

    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div
      className="w-64 min-h-screen flex flex-col justify-between
                 bg-[#1f2a44] text-gray-300 shadow-xl"
    >
      <div>
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <FaDumbbell className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Trainer Panel
          </h1>
        </div>

        <nav className="mt-6 space-y-1">
          <SidebarLink to="/trainer-home" icon={<FaHome />} label="Home" />
          <SidebarLink to="/assigned-users" icon={<FaUsers />} label="Assigned Users" />
          <SidebarLink to="/workout-plan" icon={<FaRunning/>} label="Workout Plan" />
          <div className="px-6 py-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-md
                         hover:bg-white/10 transition text-gray-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-6 py-3 relative
                 hover:bg-white/10 transition group"
    >
      <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 opacity-0 group-hover:opacity-100"></span>

      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}