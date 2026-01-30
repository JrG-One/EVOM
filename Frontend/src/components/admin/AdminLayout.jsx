import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { authUser, logout } = useAuthStore();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Interviews', icon: Briefcase, path: '/admin/interviews' },
        { name: 'Resources', icon: BookOpen, path: '/admin/resources' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0A0A0F] border-r border-white/5">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <span className={`font-black tracking-tighter text-xl transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                    Admin<span className="text-purple-500">Whiz</span>
                </span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
              ${isActive
                                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                        <span className={`font-medium transition-all duration-300 ${!isSidebarOpen && 'lg:hidden'}`}>
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Profile/Footer */}
            <div className="p-4 border-t border-white/5">
                <div className={`
          flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5
          ${!isSidebarOpen && 'lg:justify-center lg:p-2'}
        `}>
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                        {authUser?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className={`flex-1 min-w-0 ${!isSidebarOpen && 'lg:hidden'}`}>
                        <p className="text-sm font-bold truncate text-white">{authUser?.username}</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-black">{authUser?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className={`p-2 text-gray-500 hover:text-red-400 transition-colors ${!isSidebarOpen && 'lg:hidden'}`}
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden">
            {/* PC Sidebar */}
            <aside className={`
        hidden lg:block transition-all duration-500 ease-in-out relative z-30
        ${isSidebarOpen ? 'w-[280px]' : 'w-[100px]'}
      `}>
                <SidebarContent />
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white border-2 border-[#030303] hover:scale-110 transition-all shadow-lg"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            </aside>

            {/* Mobile Sidebar */}
            <div className={`
        lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`
          w-[280px] h-full transition-transform duration-500 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `} onClick={e => e.stopPropagation()}>
                    <SidebarContent />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden p-4 flex items-center justify-between bg-[#0A0A0F] border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg">
                            <ShieldAlert className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black tracking-tighter">AdminWhiz</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
