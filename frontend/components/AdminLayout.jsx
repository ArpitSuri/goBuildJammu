import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Diamond,
    User,
    MessageCircle,
    Box,
    UserCheck2
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Insights', path: '/admin', icon: LayoutDashboard },
        // { name: 'Client Orders', path: '/admin/orders', icon: ShoppingCart },
        // { name: 'Inventory', path: '/admin/products', icon: Package },
        { name: 'Products', path: '/admin/products', icon: Box },
        { name: 'Curations', path: '/admin/categories', icon: Settings },
        { name: 'Attributes', path: '/admin/attributes', icon: Bell },
        { name: 'Orders', path: '/admin/orders', icon: Package },
        { name: 'Add Suppliers', path: '/admin/suppliers', icon: UserCheck2 },
        { name: 'Add Delivery', path: '/admin/delivery', icon: UserCheck2 },
        
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans">

            {/* Logout Modal - Refined Design */}
            {logoutModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#eee9e3] shadow-2xl w-full max-w-sm p-8 border border-slate-100">
                        <h2 className="text-xl font-serif text-slate-900 mb-2 text-center">Terminate Session?</h2>
                        <p className="text-slate-500 mb-8 text-center font-light text-sm italic">
                            You are about to sign out of the CLGJewel Management Suite.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setLogoutModal(false)}
                                className="flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Return
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-3 text-xs uppercase tracking-widest font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-xs"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Now "Deep Slate" instead of pure black */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 text-gray-700 transform transition-transform duration-300 z-30 lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Brand Header */}
                <div className="flex items-center px-8 h-24 border-b border-slate-800/50">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-gray-800">
  Shree<span className="text-green-700">jal</span>
</span>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-8">
                    <nav className="px-6 space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-6 px-4">Management</p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
  isActive
    ? 'bg-green-50 text-green-700 font-medium'
    : 'text-gray-500 hover:text-green-700 hover:bg-gray-50'
}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className={`w-4 h-4 mr-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                                    <span className={isActive ? "font-semibold" : "font-light"}>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Section */}
                <div className="p-6 border-t border-slate-800/50">
                    <button
                        onClick={() => setLogoutModal(true)}
                        className="flex items-center w-full px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header */}
                <header className="flex items-center justify-between px-8 bg-white border-b border-gray-200 h-20 lg:justify-end">
                    <button
                        className="text-slate-500 hover:text-slate-900 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-8">
                        <button className="text-slate-400 hover:text-slate-900 relative transition-colors">
                            <Bell className="w-5 h-5 stroke-[1.5]" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-slate-900 border-2 border-white rounded-full"></span>
                        </button>

                        <div className="flex items-center pl-6 border-l border-slate-100">
                            <div className="text-right mr-4 hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">Executive Admin</p>
                                <p className="text-[10px] text-slate-400 italic font-light">clgjewel.com</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                                <User size={20} strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 ">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;