import { Import } from 'lucide-react'
import React from 'react'
import img1 from '../assets/images/1.jpg';
import { NavLink, useNavigate } from 'react-router-dom'


const Navbar = () => {

const navigate = useNavigate()


  return (
    <div className='navbar'>
        <img src={img1}alt="Logo" className='w-20 h-20'/>
        <ul>
            <NavLink to={'/'}>  <li>Home</li></NavLink>
          <NavLink to={'/CreateEvent'}>  <li>Create Event</li></NavLink>
          <NavLink to={'/EventDetails'}>     <li>Event Details</li></NavLink>
        <NavLink to={'/EventListings'}> <li>Event Listings</li></NavLink>
        <NavLink to={'/Pay'}> <li>Pay</li></NavLink>
      

        </ul>
        <button onClick={ ()=> navigate('/EventListings', {replace:true})}>View Events</button>
    </div>
  )
}

export default Navbar