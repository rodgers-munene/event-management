import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import BASE_URL from '../../api';
import Popup from './Popup';

const Login = () => {
  const { toggleAuthForm } = useAuth();
  const [password, setPassword] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
        const response = await fetch(`${BASE_URL}/users/login`, {
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
          localStorage.setItem('user', JSON.stringify(data)); // Store user data in localStorage

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = './'; // Redirect after showing the popup for 2 seconds
          }, 2000);
        } else {
          const errorData = await response.json();
          setPopupMessage(errorData.error || 'Login failed');
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Login error:', error);
        setPopupMessage('An error occurred. Please try again later.');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-auto max-h-[23rem] bg-gray-100 dark:bg-gray-700 dark:text-white shadow-xl rounded-lg flex flex-col justify-between p-4">
      <div className="flex justify-center w-full">
        <p className="flex items-center text-3xl font-bold">
          <FaCalendarAlt /> EventPro
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col my-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={user_email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="p-2 my-2 text-black border border-gray-300"
              required
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="p-2 my-2 text-black border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full p-2 my-2 text-white bg-gray-900"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center">
        <p className="mb-2">
          <a href="#reset">Forgot password?</a>
        </p>
        <p>
          Don't have an account?{' '}
          <span
            className="text-gray-600 cursor-pointer dark:text-gray-200"
            onClick={toggleAuthForm}
          >
            Sign Up
          </span>
        </p>
      </div>

      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Login;
