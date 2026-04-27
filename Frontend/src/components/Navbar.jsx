import React, { useState, useEffect } from "react";
import { ArrowRight, Brain, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const isLandingPage = location.pathname === "/" || location.pathname === "/home" || location.pathname === "/evom";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-700 ${scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border py-4 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                ENTERVUE
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-primary uppercase mt-1">Global Hub</span>
            </div>
          </div>

          {/* Navigation Links (If on Landing Page) */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-10">
              {['Vision', 'Architecture', 'Engine'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            
            <button
              className="hidden md:flex bg-primary text-primary-foreground px-6 py-2 rounded-xl font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/10"
              onClick={() => navigate("/get-started")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-muted-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-border py-8 px-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          {['Vision', 'Architecture', 'Engine'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {item}
            </a>
          ))}
          <hr className="border-border" />
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/get-started");
            }}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold uppercase tracking-widest"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

