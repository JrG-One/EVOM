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
import { ThemeToggle } from "./ThemeToggle";

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
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar selection:bg-primary/30 transition-all duration-500">
      <SidebarHeader className="p-6 pb-2">
        <div className={`flex items-center gap-4 transition-all duration-500 ${!open && "justify-center translate-x-1"}`}>
          <div className="relative group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-xl tracking-tighter">EV</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-10 group-hover:opacity-30 transition duration-500" />
          </div>
          {open && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-foreground font-bold tracking-tight text-xl leading-tight">Entervue</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Portal</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent/80 transition-all duration-300 group/item"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3">
                      <div className="relative group-hover/item:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5 transition-colors duration-300 group-hover/item:text-primary" />
                        <div className="absolute inset-0 blur-lg bg-primary/0 group-hover/item:bg-primary/20 transition-all duration-300" />
                      </div>
                      {open && (
                        <span className="text-sm font-semibold tracking-tight transition-all duration-300 group-hover/item:translate-x-1">
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

      <SidebarFooter className="p-4 border-t border-border mt-auto space-y-2">
        <div className={`flex items-center gap-3 px-3 py-1 ${!open && "justify-center"}`}>
          <ThemeToggle />
          {open && <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Theme</span>}
        </div>
        <button
          className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 group/logout"
          onClick={logout}
        >
          <div className="relative group-hover/logout:rotate-12 transition-transform duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          {open && (
            <span className="text-xs font-bold tracking-widest uppercase">
              Logout
            </span>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

