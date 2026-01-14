import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-gradient-to-r from-blue-900 to-indigo-600 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Website Name */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">MX</span>
            </div>
            <span
              className={`ml-3 font-bold text-xl ${scrolled ? "text-sky-800" : "text-white"}`}
            >
              InterviewWhiz
            </span>
          </div>

          {/* Get Started Button (Desktop) / Arrow (Mobile) */}
          <div>
            <button
              className={`
              rounded-full font-medium transition-all duration-200 hover:cursor-pointer
              ${
                scrolled
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:shadow-lg"
                  : "bg-white text-sky-800 hover:bg-sky-50 hover:shadow-lg"
              }
              ${"px-6 py-2.5 md:block hidden"}
            `}
              onClick={() => navigate("/get-started")}
            >
              <span className="md:inline">Get Started</span>
              <ArrowRight className="inline ml-1 h-5 w-5" />
            </button>
            <button
              className={`
              rounded-full p-2.5 md:hidden block
              ${
                scrolled
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:shadow-lg"
                  : "bg-white text-sky-800 hover:bg-sky-50 hover:shadow-lg"
              }
            `}
              onClick={() => navigate("/get-started")}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
