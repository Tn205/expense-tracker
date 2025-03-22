import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../layouts/Navbar";

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      localStorage.clear();
      const response = await toast.promise(axios.post("/user/login", data), {
        pending: "Logging in...",
        success: "Login successful! 🎉",
        error: "Login failed! Invalid credentials.",
      });
  
      console.log(response.data);
  
      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        localStorage.setItem("userid", response.data.id);
        localStorage.setItem("role", response.data.role?.name || "User");
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const Validators = {
    emailValidator: {
      required: {
        value: true,
        message: "Email is required"
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "Invalid email format",
      },
    },
    passwordValidator: {
      required: {
        value: true,
        message: "Password is required",
      },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    }
  }

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-card">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email*/}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                id="email" 
                autoComplete="email" 
                placeholder="Enter your email address" 
                className={errors.email ? "input-error" : ""} 
                {...register("email", Validators.emailValidator)} 
              />
              {errors.email && <span className="login-error-message">{errors.email.message}</span>}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className={errors.password ? "input-error" : ""} 
                {...register("password", Validators.passwordValidator)} 
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.password && <span className="login-error-message">{errors.password.message}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="actions">
            <button type="submit" className="btn-login">Login</button>
          </div>
        </form>

        <div className="register-link">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};
