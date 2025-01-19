import { Import } from 'lucide-react'
import React, { useState } from 'react'
import img1 from '../assets/images/1.jpg';
import { NavLink, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa';


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

const navigate = useNavigate()
const location = useLocation()

const handleClick = () => {
  navigate('/authentication');
};

const excludedPaths = ['/event-listings'];
  return (
    <div className='navbar'>
        <img 
          onClick={() => navigate('/')}
          src={img1}alt="Logo"
          className='w-20 h-20'/>
        <ul className='dark:bg-gray-800 bg-graye-300'>
            <NavLink to={'/'}>  <li>Home</li></NavLink>
            <NavLink to={'/create-event'}>  <li>Create Event</li></NavLink>
            {/* <NavLink to={'/event-details'}>     <li>Event Details</li></NavLink> */}
            <NavLink to={'/event-listings'}> <li>Event Listings</li></NavLink>
            {/* <NavLink to={'/pay'}> <li>Pay</li></NavLink> */}
      

        </ul>
        
       
      <div className='flex items-center'>
      {!isLoggedIn ? (
              <button 
                onClick={handleClick}
                className='dark:bg-gray-300 bg-gray-800 text-white dark:text-black'>
                Login
              </button>
            ) : (
              <p className=' text-black dark:text-white flex items-center p-2 rounded-sm'>
                <span className='mr-2 '><FaUser /></span> 
                Rodgers
              </p>
      )}
      </div>
           
    </div>
  )
}

export default Navbar