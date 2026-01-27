import React, { useState, useEffect } from "react";
import { ArrowRight, Brain, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled
          ? "bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 py-3"
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <Brain className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none">
                ENTERVUE
              </span>
              <span className="text-[7px] font-bold tracking-[0.4em] text-purple-400 uppercase mt-1">Global Hub</span>
            </div>
          </div>

          {/* Navigation Links (If on Landing Page) */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-10">
              {['Vision', 'Architecture', 'Engine'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              className="hidden md:flex bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
              onClick={() => navigate("/get-started")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white/60 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#030303]/95 backdrop-blur-2xl border-b border-white/5 py-10 px-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          {['Vision', 'Architecture', 'Engine'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-black uppercase tracking-tighter text-white"
            >
              {item}
            </a>
          ))}
          <hr className="border-white/5" />
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/get-started");
            }}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
