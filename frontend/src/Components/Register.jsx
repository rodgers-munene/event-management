import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import BASE_URL from '../../api';

const Register = () => {
  const { toggleAuthForm } = useAuth();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    password: '',
    confirmPassword: '',
  });
  const [isAlert, setIsAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);  // To control the visibility of the success message
  const [popupMessage, setPopupMessage] = useState('');

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    if (password !== confirmPassword) return "Passwords don't match";

    return null; // No validation errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAlert('');

    const error = validateForm();
    if (error) {
      setIsAlert(error);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsAlert(errorData.error || 'Registration failed');
        return;
      }

      const data = await response.json();
      setIsAlert('Registration successful! Please log in.');
      setPopupMessage('Registration successful! Please log in.');
      setShowPopup(true); // Show the success popup
      setTimeout(() => toggleAuthForm(), 1000);
    } catch (err) {
      console.error('Registration error:', err);
      setIsAlert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-auto h-full bg-gray-100 dark:bg-gray-700 dark:text-white shadow-xl rounded-lg flex flex-col justify-between p-4">
      <div className="w-full flex justify-center">
        <p className="text-3xl font-bold flex items-center">
          <FaCalendarAlt /> EventPro
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {['user_name', 'user_email', 'password', 'confirmPassword'].map((field) => (
          <div className="flex flex-col my-2" key={field}>
            <label htmlFor={field} className="capitalize">
            </label>
            <input
              type={
                field === 'user_email'
                  ? 'email'
                  : field.includes('password')
                  ? 'password'
                  : 'text'
              }
              id={field}
              name={field}
              placeholder={
                field === 'user_email'
                  ? 'Email'
                  : field === 'user_name'
                  ? 'Username'
                  : field === 'confirmPassword'
                  ? 'Confirm Password'
                  : 'Password'
              }
              value={formData[field]}
              onChange={handleChange}
              className={`border border-gray-300 p-2 my-2 text-black ${
                isAlert && field.includes('password') ? 'border-red-600' : ''
              }`}
              required
            />
          </div>
        ))}
        {isAlert && (
          <div className="text-xs text-red-600">
            <p>{isAlert}</p>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="bg-gray-900 text-white p-2 w-full my-2"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {/* Success Popup Message */}
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-gray-900 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <p>
          Already have an account?{' '}
          <span
            className="text-gray-600 dark:text-gray-200 cursor-pointer"
            onClick={toggleAuthForm}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
