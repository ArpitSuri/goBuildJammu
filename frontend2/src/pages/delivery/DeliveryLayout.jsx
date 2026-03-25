import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Bell,
  User,
} from "lucide-react";

const DeliveryLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/delivery", icon: LayoutDashboard },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* LOGOUT MODAL */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">

            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Logout
            </h2>

            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r transform transition-transform duration-300 z-30 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* LOGO */}
        <div className="flex items-center px-6 h-16 border-b">
          <span className="text-xl font-semibold text-gray-800">
            Shree<span className="text-green-700">jal</span>
          </span>
        </div>

        {/* NAV */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-3 ${
                    isActive ? "text-green-700" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={() => setLogoutModal(true)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 bg-white border-b h-16">

          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">

            {/* NOTIFICATION */}
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full"></span>
            </button>

            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  Delivery Agent
                </p>
                <p className="text-xs text-gray-500">
                  dashboard
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <User size={18} />
              </div>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;