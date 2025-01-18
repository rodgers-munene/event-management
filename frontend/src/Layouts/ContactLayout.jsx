import React from 'react'
import EventListings from '../Pages/Event Listings'
import { Outlet } from 'react-router-dom'

const ContactLayout = () => {
  return (
    <div>
        <EventListings />
        <Outlet />
    </div>
  )
}

export default ContactLayout