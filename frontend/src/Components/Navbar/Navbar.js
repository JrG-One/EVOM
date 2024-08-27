import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { useAuth } from '../../authContext'; // Assuming this context handles both user and company auth

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn: isUserLoggedIn, logout: userLogout } = useAuth(); // For user authentication
  const { isLoggedIn: isCompanyLoggedIn, logout: companyLogout } = useAuth(); // For company authentication

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    if (isUserLoggedIn) {
      userLogout();
    } else if (isCompanyLoggedIn) {
      companyLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="Left" onClick={handleLogoClick}>
        <h3 className="logo">InterviewWhiz</h3>
      </div>
      <div className="right">
        <Link to="/">Home</Link>
        <Link to="/interview-portal">Portal</Link>
        <Link to="/interview-portal">Resume</Link>
        <Link to="/resource">Resources</Link>

        {/* User-specific links */}
        {isUserLoggedIn ? (
          <Link onClick={handleLogout} to="/login">Sign Out</Link>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Company-specific links */}
        {!isCompanyLoggedIn && (
          <>
            <Link to="/company-register">Company Register</Link>
            <Link to="/company-login">Company Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
