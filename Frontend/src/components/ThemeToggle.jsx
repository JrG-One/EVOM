import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-xl transition-all duration-300 hover:bg-primary/10 group cursor-pointer border border-border/50 dark:border-transparent bg-background shadow-sm dark:shadow-none"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 fill-amber-500/20" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400 fill-indigo-400/20" />
      <span className="sr-only">Toggle theme</span>
      
      {/* Premium background glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 -z-10" />
    </Button>
  );
}
