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
        <div className="flex flex-col h-full bg-sidebar border-r border-border">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className={`font-black tracking-tighter text-xl transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                    Admin<span className="text-primary">Whiz</span>
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
                                ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20 text-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
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
            <div className="p-4 border-t border-border">
                <div className={`
          flex items-center gap-3 p-3 rounded-2xl bg-accent/50 border border-border
          ${!isSidebarOpen && 'lg:justify-center lg:p-2'}
        `}>
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold">
                        {authUser?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className={`flex-1 min-w-0 ${!isSidebarOpen && 'lg:hidden'}`}>
                        <p className="text-sm font-bold truncate text-foreground">{authUser?.username}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">{authUser?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className={`p-2 text-muted-foreground hover:text-destructive transition-colors ${!isSidebarOpen && 'lg:hidden'}`}
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* PC Sidebar */}
            <aside className={`
        hidden lg:block transition-all duration-500 ease-in-out relative z-30
        ${isSidebarOpen ? 'w-[280px]' : 'w-[100px]'}
      `}>
                <SidebarContent />
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-2 border-background hover:scale-110 transition-all shadow-lg"
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
                <header className="lg:hidden p-4 flex items-center justify-between bg-sidebar border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-lg">
                            <ShieldAlert className="w-4 h-4 text-primary-foreground" />
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
