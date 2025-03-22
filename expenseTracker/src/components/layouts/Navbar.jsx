import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".sidebar") && !event.target.closest(".menu-btn")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar">
          {/* Logo */}
          <h2 className="logo">
            Expense Tracker
          </h2>

          {/* Menu Button (for mobile) */}
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>

          {/* Navbar Links (for large screens) */}
          <ul className="nav-links">
            <li><Link className="link" to="/">Home</Link></li>
            {/* <li><Link className="link" to="/sample">Sample</Link></li> */}
            <li><Link className="link" to="/user/dashboard">Dashboard</Link></li>
            <li><Link className="link" to="/user/expenses">Expenses</Link></li>
            <li><Link className="link" to="/user/reports">Reports</Link></li>
            <li><Link className="link" to="/user/profile">Profile</Link></li>
            <li><Link className="link" to="/user/budget-form">Budget</Link></li>
          </ul>

          {/* Sidebar (for small screens) */}
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <ul>
              <li><Link className="link" to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              {/* <li><Link className="link" to="/sample" onClick={() => setIsOpen(false)}>Sample</Link></li> */}
              <li><Link className="link" to="/user/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
              <li><Link className="link" to="/user/expenses" onClick={() => setIsOpen(false)}>Expenses</Link></li>
              <li><Link className="link" to="/user/reports" onClick={() => setIsOpen(false)}>Reports</Link></li>
              <li><Link className="link" to="/user/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
              <li><Link className="link" to="/user/budget-form" onClick={() => setIsOpen(false)}>Budget</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <Outlet />
    </>
  );
};
