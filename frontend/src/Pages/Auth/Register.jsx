import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Popup from "../../Components/Popup";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const { toggleAuthForm } = useAuth();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    password: "",
    confirmPassword: "",
  });
  const [isAlert, setIsAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // To control the visibility of the success message
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Za-z]/.test(password))
      return "Password must contain at least one letter";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(password))
      return "Password must contain at least one special character";
    if (password !== confirmPassword) return "Passwords don't match";

    return null; // No validation errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAlert("");

    const error = validateForm();
    if (error) {
      setIsAlert(error);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsAlert(errorData.message || "Registration failed");
        return;
      }

      const data = await response.json();
      setIsAlert("Registration successful! Please log in.");
      setPopupMessage("Registration successful! Please log in.");
      setShowPopup(true); // Show the success popup

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setIsAlert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
  <div className="relative w-full max-w-md min-h-[32rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-2xl rounded-xl flex flex-col justify-between p-8">
    <div className="w-full flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <FaCalendarAlt className="text-3xl text-purple-800" />
        <p className="text-3xl font-bold text-purple-800">
          EventPro
        </p>
      </div>
    </div>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <input
          type="text"
          id="user_name"
          name="user_name"
          placeholder="Your Name"
          required
          value={formData.user_name}
          onChange={handleChange}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 "
        />
      </div>
      
      <div className="flex flex-col">
        <input
          type="email"
          id="user_email"
          name="user_email"
          required
          placeholder="Your Email"
          value={formData.user_email}
          onChange={handleChange}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="flex flex-col">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="flex flex-col">
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 "
        />
      </div>
      
      {isAlert && (
        <div className="text-sm text-purple-600 dark:text-purple-400 py-2 transition-colors duration-300">
          <p>{isAlert}</p>
        </div>
      )}
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : "Create Account"}
        </button>
      </div>
    </form>

    {/* Success Popup Message */}
    {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
    )}

    <div className="text-center pt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <p>
        Already have an account?{" "}
        <span
          className="text-purple-600 cursor-pointer font-medium"
          onClick={() => navigate('/login')}
        >
          Sign In
        </span>
      </p>
    </div>
  </div>
</div>
  );
};

export default Register;
