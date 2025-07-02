import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
const BASE_URL = import.meta.env.VITE_BASE_URL
import Popup from '../../Components/Popup';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const { token, user, setToken, setUser } = useAuth();
  const [password, setPassword] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate()

  const validateForm = () => {
    if (!user_email) {
      setPopupMessage('Email is required');
      setShowPopup(true);
      return false;
    }
    if (!password) {
      setPopupMessage('Password is required');
      setShowPopup(true);
      return false;
    } else if (password.length < 6) {
      setPopupMessage('Password must be at least 6 characters');
      setShowPopup(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email, // Using state variable for email
            password,   // Using state variable for password
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPopupMessage('Login successful!');
          setShowPopup(true);
          localStorage.setItem('user', JSON.stringify(data.userDetails)); // Store user data in localStorage
          setUser(data.userDetails)
          localStorage.setItem('token', data.token)
          setToken(data.token)

          const decoded = jwtDecode(data.token)
          const expiresAt = decoded.exp * 1000
          localStorage.setItem('expiresAt', expiresAt)
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/'); // Redirect after showing the popup for 2 seconds
          }, 2000);
        } else {
          const errorData = await response.json();
          setPopupMessage(errorData.message || 'Login failed');
          setShowPopup(true);
          return;
        }
      } catch (error) {
        setPopupMessage('An error occurred. Please try again later.');
        setShowPopup(true);
        return;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
   <div className='w-screen h-screen flex justify-center items-center'>
     <div className="relative w-full max-w-md min-h-[24rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-2xl rounded-xl flex flex-col justify-between p-8">
      <div className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-3xl text-purple-800" />
              <p className="text-3xl font-bold text-purple-800">
                EventPro
              </p>
            </div>
          </div>
      <div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className="flex flex-col my-2">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={user_email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 "
              required
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
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
              logging in...
            </span>
          ) : "Login"}
        </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center">
        <p className="mb-2">
          <a href="#reset" className='text-purple-700'>Forgot password?</a>
        </p>
        <p>
          Don't have an account?{' '}
          <span
            className="text-purple-800 cursor-pointer"
            onClick={() => 
              navigate('/signup')
            }
          >
            Sign Up
          </span>
        </p>
      </div>

      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
   </div>
  );
};

export default Login;
