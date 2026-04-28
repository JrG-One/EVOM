import {
  LogOut,
  Book,
  GraduationCap,
  SearchCodeIcon,
  LayoutDashboard,
  UserCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ThemeToggle } from "./ThemeToggle";

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
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: UserCircle },
  { title: "Resources", url: "/resources", icon: Book },
  { title: "Portal", url: "/portal", icon: GraduationCap },
  { title: "Resume Analyser", url: "/analyser", icon: SearchCodeIcon },
];

export function AppSidebar() {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate(); // <-- Added navigate hook
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";

  const toggleSidebar = () => setOpen(state === "collapsed");

  // Custom handleLogout to combine actions
  const handleLogout = async () => {
    await logout(); // Ensure any API/state clearing is done
    navigate('/get-started'); // Then redirect
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar/95 backdrop-blur-xl transition-all duration-500"
    >
      {/* Floating Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-20 w-7 h-7 bg-primary rounded-full items-center justify-center text-primary-foreground border-4 border-background hover:scale-110 transition-all shadow-xl z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" strokeWidth={3} /> : <ChevronLeft className="w-4 h-4" strokeWidth={3} />}
      </button>

      {/* Header Alignment Fix */}
      <SidebarHeader className={`py-4 transition-all duration-300 flex flex-row items-center ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
        <div className={`relative flex-shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-500 ${isCollapsed ? "h-9 w-9" : "h-11 w-11"}`}>
          <img
            src="/evomlogo.png"
            alt="EVOM"
            className="w-[75%] h-[75%] object-contain"
          />
        </div>

        {!isCollapsed && (
          <div className="flex flex-col ml-4 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="text-foreground font-black tracking-tighter text-xl leading-none">EVOM</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Workspace</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`relative h-12 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        } ${isCollapsed ? "justify-center px-0" : "px-3"}`}
                    >
                      <Link to={item.url} className="flex items-center w-full">
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'scale-110 text-primary' : ''}`} />
                        {!isCollapsed && (
                          <span className="ml-3 text-sm font-semibold tracking-tight">{item.title}</span>
                        )}
                        {/* Active Bar */}
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Alignment Fix */}
      <SidebarFooter className={`p-4 border-t border-border/50 flex flex-col gap-3 ${isCollapsed ? "items-center" : ""}`}>
        <div className={`flex items-center rounded-xl bg-accent/40 border border-border/50 transition-all ${isCollapsed ? "w-10 h-10 justify-center p-0" : "w-full p-2 gap-3"}`}>
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
            {authUser?.username?.[0]?.toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{authUser?.username}</p>
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-1 w-full ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center rounded-lg hover:bg-accent transition-colors ${isCollapsed ? "justify-center w-10 h-10" : "px-3 py-2 gap-3"}`}>
            <ThemeToggle />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Theme</span>}
          </div>

          <button
            onClick={handleLogout} // <-- Updated onClick handler
            className={`flex items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all ${isCollapsed ? "justify-center w-10 h-10" : "px-3 py-2 gap-3"}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}