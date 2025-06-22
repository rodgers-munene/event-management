import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import ThemeToggle from '../Components/ThemeToggle';

const RouteLayout = ( {children} ) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <Navbar />
      <ThemeToggle />

      <main>
        {children}
      </main>

    </div>
  )
}

export default RouteLayout