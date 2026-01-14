import { Home, LogOut, Book, GraduationCap, SearchCodeIcon } from "lucide-react";

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
    title: "Profile",
    url: "",
    icon: Home,
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className={`flex gap-2 ${open ? "p-2" : ""} items-center`}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-md">MX</span>
          </div>
          {open ? <span>InterviewWhiz</span> : ""}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button
          className="flex p-2 items-center cursor-pointer"
          onClick={logout}
        >
          <LogOut size={16} />
          {open ? <div className="p-2 text-lg">Logout</div> : ""}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
