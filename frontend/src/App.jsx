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


import Error from './Components/Error'

const App = () => {

  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RouteLayout />}>
 <Route index ='/' element={<HomePage/>} />
  <Route path='CreateEvent' element={<CreateEvent/>} />
  <Route path='EventDetails' element={<EventDetails/>} />
    <Route path='EventListings' element={<ContactLayout/>}>  {/* // Nested route */} 
  <Route path='info' element={<Login/>} />
  <Route path='form' element={<ContactForm/>} />
   </Route>
   <Route path='Pay' element={<Pay/>} />

 

<Route  path='*' element={<NotFound />} />


      </Route>
    )
  )


  return (
 <>
<RouterProvider router={(Router)} />


 </>
  )
}

export default App