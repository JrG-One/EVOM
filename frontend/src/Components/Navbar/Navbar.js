import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { useAuth } from '../../authContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
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
        {isLoggedIn ? (
          <Link onClick={handleLogout} to="/login">Sign Out</Link> // Render sign-out button if user is logged in
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
