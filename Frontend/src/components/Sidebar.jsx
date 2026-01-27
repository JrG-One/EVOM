import { Home, LogOut, Book, GraduationCap, SearchCodeIcon, LayoutDashboard, UserCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircle,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: Book,
  },
  {
    title: "Portal",
    url: "/portal",
    icon: GraduationCap,
  },
  {
    title: "Resume Analyser",
    url: "/analyser",
    icon: SearchCodeIcon,
  },
];

export function AppSidebar({ open }) {
  const { logout } = useAuthStore();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 !bg-[#050505] selection:bg-purple-500/30 transition-all duration-500">
      <SidebarHeader className="p-6 pb-2">
        <div className={`flex items-center gap-4 transition-all duration-500 ${!open && "justify-center translate-x-1"}`}>
          <div className="relative group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(139,92,246,0.5)] group-hover:shadow-[0_12px_24px_-8px_rgba(139,92,246,0.7)] transition-all duration-500 group-hover:scale-105">
              <span className="text-white font-black text-xl tracking-tighter">EV</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
          </div>
          {open && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-white font-black tracking-tight text-xl leading-tight">Entervue</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-[9px] text-purple-400/90 uppercase tracking-[0.25em] font-black">Student Portal</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] active:bg-white/10 transition-all duration-300 group/item"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3">
                      <div className="relative group-hover/item:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5 transition-colors duration-300 group-hover/item:text-purple-400" />
                        <div className="absolute inset-0 blur-lg bg-purple-500/0 group-hover/item:bg-purple-500/20 transition-all duration-300" />
                      </div>
                      {open && (
                        <span className="text-sm font-bold tracking-wide transition-all duration-300 group-hover/item:translate-x-1">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 mt-auto">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group/logout"
          onClick={logout}
        >
          <div className="relative group-hover/logout:rotate-12 transition-transform duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          {open && (
            <span className="text-sm font-bold tracking-widest uppercase animate-in fade-in slide-in-from-bottom-2">
              Logout
            </span>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
