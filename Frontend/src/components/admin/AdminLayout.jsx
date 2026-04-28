import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    BookOpen,
    ToggleLeft,
    ClipboardList,
    Coins,
    Download,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { authUser, logout } = useAuthStore();
    const location = useLocation();

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin/overview' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Feature Toggles', icon: ToggleLeft, path: '/admin/feature-toggles' },
        { name: 'User Logs', icon: ClipboardList, path: '/admin/logs' },
        { name: 'AI Credits', icon: Coins, path: '/admin/credits' },
        { name: 'Exports', icon: Download, path: '/admin/exports' },
        { name: 'Interviews', icon: Briefcase, path: '/admin/interviews' },
        { name: 'Resources', icon: BookOpen, path: '/admin/resources' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-sidebar/95 backdrop-blur-xl border-r border-border selection:bg-primary/30 transition-all duration-300">
            {/* Brand Header - Refined with Logo */}
            <div className={`p-6 flex items-center gap-4 border-b border-border/50 ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}>
                <div className="relative group flex-shrink-0">
                    <div className={`rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm transition-all duration-500 overflow-hidden ${isSidebarOpen ? 'h-11 w-11' : 'h-10 w-10'}`}>
                        <img
                            src="/evomlogo.png"
                            alt="EVOM"
                            className="w-[75%] h-[75%] object-contain"
                        />
                    </div>
                </div>

                {isSidebarOpen && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                        <span className="font-black tracking-tighter text-xl leading-none">
                            EVOM
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">ADMIN Management</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 space-y-1.5 mt-6">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`
                                relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
                                ${!isSidebarOpen && 'lg:justify-center lg:px-0'}
                            `}
                        >
                            {/* Active Side Highlight */}
                            {isActive && isSidebarOpen && (
                                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_hsl(var(--primary))]" />
                            )}

                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`} />

                            {isSidebarOpen && (
                                <span className={`text-sm tracking-tight transition-all duration-300 ${isActive && 'translate-x-1'}`}>
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-border/50">
                <div className={`
                    flex items-center gap-3 p-2 rounded-2xl bg-accent/40 border border-border/50 transition-all
                    ${!isSidebarOpen && 'lg:justify-center lg:w-12 lg:h-12 lg:p-0 mx-auto'}
                `}>
                    <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner">
                        {authUser?.username?.[0]?.toUpperCase()}
                    </div>
                    {isSidebarOpen && (
                        <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                            <p className="text-xs font-black truncate text-foreground leading-none">{authUser?.username}</p>
                            <p className="text-[9px] uppercase tracking-tighter text-primary font-bold mt-1">{authUser?.role}</p>
                        </div>
                    )}
                    {isSidebarOpen && (
                        <button
                            onClick={logout}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
            {/* PC Sidebar */}
            <aside className={`
                hidden lg:block transition-all duration-500 ease-in-out relative z-30
                ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'}
            `}>
                <SidebarContent />
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-[4px] border-background hover:scale-110 transition-all shadow-xl z-40"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" strokeWidth={3} /> : <ChevronRight className="w-4 h-4" strokeWidth={3} />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div className={`
                lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300
                ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`
                    w-[280px] h-full transition-transform duration-500 ease-out shadow-2xl
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `} onClick={e => e.stopPropagation()}>
                    <SidebarContent />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 px-6 flex items-center justify-between bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                            <img src="/evomlogo.png" alt="EVOM" className="w-[70%] h-[70%] object-contain" />
                        </div>
                        <span className="font-black tracking-tighter text-lg">Admin<span className="text-primary">Whiz</span></span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-accent rounded-xl transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#FAFAFB] dark:bg-transparent scroll-smooth custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;