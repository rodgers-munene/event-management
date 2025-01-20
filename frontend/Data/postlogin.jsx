import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { toggleAuthForm } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAlert, setIsAlert] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    if (!email || !password) {
      setIsAlert('Email and Password are required');
      setTimeout(() => {
        setIsAlert('');
      }, 3000);
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login (e.g., store JWT token or user info)
        alert('Login successful');
        // Redirect or update state with user data here
      } else {
        const errorData = await response.json();
        setIsAlert(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAlert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-auto max-h-[23rem] bg-gray-100 dark:bg-gray-700 dark:text-white shadow-xl rounded-lg flex flex-col justify-between p-4">
      <div className="w-full flex justify-center">
        <p className="text-3xl font-bold flex items-center">
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
              className="border border-gray-300 p-2 my-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col my-2 relative">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="border border-gray-300 p-2 my-2 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute text-xs -bottom-3 text-red-600">
              <p>{isAlert}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gray-900 text-white p-2 w-full my-2"
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
            className="text-gray-600 dark:text-gray-200 cursor-pointer"
            onClick={toggleAuthForm}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
