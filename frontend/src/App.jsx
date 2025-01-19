import React from 'react'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage'
import CreateEvent from './Pages/Create Event'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import EventDetails from './Pages/Event Details'
import ContactLayout from './Layouts/ContactLayout'
import EventListings from './Pages/Event Listings'
import Pay from './Pages/Pay'
import RouteLayout from './Layouts/RouteLayout'
import Login from './Components/Login'
import ContactForm from './Components/ContactForm'
import NotFound from './Components/NotFound'
import AuthPage from './Pages/Auth'


import Error from './Components/Error'

const App = () => {

  const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<RouteLayout />}>
        <Route index ='/' element={<HomePage/>} />
        <Route path='/create-Event' element={<CreateEvent/>} />
        <Route path='/event-details/:id/:title' element={<EventDetails/>} />
        <Route path='/event-listings' element={<ContactLayout/>}>  {/* // Nested route */} 
        <Route path='info' element={<Login/>} />
        <Route path='form' element={<ContactForm/>} />
        </Route>
        <Route path='pay/:id/:title' element={<Pay/>} />

 
        <Route path='authentication' element={<AuthPage/>} />
        <Route  path='*' element={<NotFound />} />


      </Route>
    )
  )


  return (
 <div className='w-screen bg-gray-300 dark:bg-gray-900 dark:text-white transition-colors duration-300'>
<RouterProvider router={(Router)} />


 </ div>
  )
}

export default App