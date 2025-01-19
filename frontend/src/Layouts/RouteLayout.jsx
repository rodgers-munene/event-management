import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import ThemeToggle from '../Components/ThemeToggle';

const RouteLayout = () => {

  const location = useLocation();

  const excludedPaths = ['/authentication'];
  return (
    <div>
      {/* render the navbar only if the current paths is not excluded */}
      {!excludedPaths.includes(location.pathname) && <Navbar />}
      <div className='container'>
        <Outlet />
      </div>
      <ThemeToggle />

    </div>
  )
}

export default RouteLayout