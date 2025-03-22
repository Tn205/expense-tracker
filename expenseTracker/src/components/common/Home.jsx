import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Footer } from "../layouts/Footer";
import { Navbar } from "../layouts/Navbar";
// import Navbar from "../layouts/Navbar";
export const Home = () => {
  return (
    <div className="home-page">

      <Navbar />

      <div className="animated-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      
      <div className="home-content">
        <div className="glass-container">
          <div className="logo-container">
            <h1 className="brand-name">Expense Tracker</h1>
          </div>
          
          <h2 className="tagline">Smart Financial Management</h2>
          
          <p className="description">
            Take control of your finances with our intuitive expense tracking tool. 
            Monitor spending, set budgets, and visualize your financial journey.
          </p>
          
          <div className="home-buttons">
            <Link to="/register" className="btn-get-started">Get Started</Link>
            <Link to="/login" className="btn-login">Login</Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
