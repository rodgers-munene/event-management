import React, { useState } from 'react';
import Logo from '../assets/images/Logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const { isOpen, toggleMenu } = useMenu();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClick = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className='flex justify-between items-center rounded-lg w-screen sm:w-[98%] p-2 relative'>
      <h1 className='text-4xl font-bold'>Event<span className='text-purple-800'>PRO</span></h1>

      {/* Large screen navigation */}
      <ul className='hidden p-3 bg-gray-400 shadow-2xl dark:bg-gray-800 md:flex rounded-2xl'>
        <NavLink to='/'><li className='px-5'>Home</li></NavLink>
        <NavLink to='/create-event'><li className='px-5'>Create Event</li></NavLink>
        <NavLink to='/event-listings'><li className='px-5'>Event Listings</li></NavLink>
      </ul>

      {/* Small screen hamburger */}
      <div className='flex items-center md:hidden'>
        <button
          onClick={toggleMenu}
          className="text-gray-800 focus:outline-none dark:text-gray-300"
        >
          <div className="relative flex flex-col items-center justify-between w-8 h-6">
            <span className={`block w-full h-[0.2rem] bg-current transform transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-4" : ""}`} />
            <span className={`block w-full h-[0.2rem] bg-current transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-full h-[0.2rem] bg-current transform transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </div>
        </button>

        {/* Small screen nav links */}
        <ul
  className={`dark:bg-gray-800 bg-white shadow-xl flex flex-col absolute top-16 right-2 w-52 rounded-xl z-[1000] p-2 space-y-2 transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'}`
  }
>
  <li onClick={toggleMenu}>
    <NavLink
      to='/'
      className='block w-full px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
    >
      Home
    </NavLink>
  </li>

  <li onClick={toggleMenu}>
    <NavLink
      to='/create-event'
      className='block w-full px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
    >
      Create Event
    </NavLink>
  </li>

  <li onClick={toggleMenu}>
    <NavLink
      to='/event-listings'
      className='block w-full px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
    >
      Event Listings
    </NavLink>
  </li>

  <div className='border-t pt-2 mt-2 space-y-2'>
    {token === null ? (
      <button
        onClick={() => {
          handleClick();
          toggleMenu();
        }}
        className='w-full text-white bg-gray-800 dark:bg-gray-300 dark:text-black rounded-md px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors'
      >
        Login
      </button>
    ) : (
      <>
        <button
          onClick={() => {
            navigate('/profile');
            toggleMenu();
          }}
          className='w-full text-left text-sm px-4 py-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition'
        >
          View Profile
        </button>
        <button
          onClick={() => {
            logout();
            toggleMenu();
            navigate('/');
          }}
          className='w-full text-left text-sm px-4 py-2 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition'
        >
          Logout
        </button>
      </>
    )}
  </div>
</ul>

      </div>

      {/* Large screen right side: Login or User Dropdown */}
      <div className='relative hidden md:flex items-center'>
        {token === null ? (
          <button
            onClick={handleClick}
            className='text-white bg-gray-800 dark:bg-gray-300 dark:text-black rounded-xl px-4 py-1'>
            Login
          </button>
        ) : (
          <div className='relative'>
            <button
              onClick={toggleDropdown}
              className='flex items-center text-black dark:text-white px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
              <FaUser className='mr-2' />
              {user.userName}
              <FaChevronDown  className='ml-2'/>
            </button>

            {showDropdown && (
              <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                  className='w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
                  Logout
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className='w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'>
                  Close ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
