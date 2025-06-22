import { useEffect, useState } from 'react'
import img1 from '../assets/images/1.jpg';
import { NavLink, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa';
import { useMenu } from '../context/MenuContext';


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const{isOpen, toggleMenu} = useMenu()
  const [user, setUser] = useState(null);


 useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem('user'));
    if (storedData) {
      // setUser(storedData.user.name);
      setIsLoggedIn(true);
    }
}, []);
  
  

const navigate = useNavigate()
const location = useLocation()

const handleClick = () => {
  navigate('/authentication');
};

const excludedPaths = ['/event-listings'];
  return (
    <div className='navbar rounded-lg w-screen sm:w-[98%] p-2'>
        <img 
          onClick={() => navigate('/')}
          src={img1}alt="Logo"
          className='w-20 h-20 sm:ml-4'/>
        <ul className='hidden p-3 bg-gray-400 shadow-2xl dark:bg-gray-800 sm:flex rounded-2xl'>
            <NavLink to={'/'}>  <li className='px-5'>Home</li></NavLink>
            <NavLink to={'/create-event'}>  <li className='px-5'>Create Event</li></NavLink>
            {/* <NavLink to={'/event-details'}>     <li>Event Details</li></NavLink> */}
            <NavLink to={'/event-listings'}> <li className='px-5'>Event Listings</li></NavLink>
            {/* <NavLink to={'/pay'}> <li>Pay</li></NavLink> */}


        </ul>
        <div className='flex items-center sm:hidden'>

          {/* hamburger button */}
        <button
          onClick={toggleMenu}
          className="text-gray-800 sm:hidden focus:outline-none dark:text-gray-300"
        >
          <div className="relative flex flex-col items-center justify-between w-8 h-6">
            {/* Top bar */}
            <span
              className={`block w-full h-[0.2rem] bg-current transform transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-4" : ""
              }`}
            ></span>
            {/* Middle bar */}
            <span
              className={`block w-full h-[0.2rem] bg-current transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            {/* Bottom bar */}
            <span
              className={`block w-full h-[0.2rem] bg-current transform transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
            ></span>
          </div>
        </button>
              {/* small screens navigation links */}
        <ul 
        className={`dark:bg-gray-800 bg-gray-400 flex flex-col justify-around items-start absolute top-16 right-1 w-44 h-44 transform transition-transform duration-300
         ease-in-out z-[1000] rounded-lg ${isOpen ? "translate-y-5" : "-translate-y-[140%]"}`}>
              <li 
              onClick={toggleMenu}
              className='w-full p-2'>
                <NavLink to={'/'} className=''>Home</NavLink>
              </li>
             <li 
              onClick={toggleMenu}
             className='w-full p-2'>
               <NavLink to={'/create-event'}>Create Event</NavLink>
            </li>
            
             <li
             onClick={toggleMenu} 
             className='w-full p-2'>
              <NavLink to={'/event-listings'}>Event Listings</NavLink>
            </li>
           
          
            <div className='flex items-center w-full rounded-b-lg'>
            {!isLoggedIn ? (
                    <button 
                      onClick={() => {
                        handleClick();
                        toggleMenu();
                      }} 
                       className='w-full text-white bg-gray-800 rounded-b-lg dark:bg-gray-300 dark:text-black'>
                      Login
                    </button>
                  ) : (
                    <p className='flex items-center w-full p-2 text-black rounded-sm rounded-b-lg  dark:text-white'>
                      <span className='mr-2 '><FaUser /></span> 
                      {user}
                    </p>
            )}
      </div>

        </ul>
         </div>
        
       {/* large screens login button */}
      <div className='items-center hidden sm:flex'>
      {!isLoggedIn ? (
              <button 
                onClick={handleClick}
                className='text-white bg-gray-800 dark:bg-gray-300 dark:text-black rounded-xl'>
                Login
              </button>
            ) : (
              <p className='flex items-center p-2 text-black rounded-sm  dark:text-white'>
                <span className='mr-2 '><FaUser /></span> 
                {user}
              </p>
      )}
      </div>

      
           
    </div>
  )
}

export default Navbar