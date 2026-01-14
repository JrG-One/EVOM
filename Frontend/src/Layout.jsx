import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "./components/Loader";

function Layout() {
  const [open, setOpen] = useState(true);
  const { isLoggingIn } = useAuthStore();

  if (isLoggingIn) {
    return <Loader />;
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "12rem",
        "--sidebar-width-mobile": "20rem",
      }}
      className="bg-accent"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex w-full">
        <AppSidebar open={open} />
        <main className="flex-1">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
