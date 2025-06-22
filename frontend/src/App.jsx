import HomePage from './Pages/HomePage'
import CreateEvent from './Pages/Create Event'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import EventDetails from './Pages/Event Details'
import EventListings from './Pages/Event Listings'
import Pay from './Pages/Pay'
import RouteLayout from './Layouts/RouteLayout'
import NotFound from './Components/NotFound'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'

const App = () => {

        

  return (
 <div className='w-screen bg-gray-300 dark:bg-gray-900 dark:text-white transition-colors duration-300'>
  <Router>
    <Routes>
        <Route index ='/' element={<RouteLayout><HomePage/></RouteLayout>} />
        <Route path='/create-Event' element={<RouteLayout><CreateEvent/></RouteLayout>} />
        <Route path='/event-details/:id/:title' element={<RouteLayout><EventDetails/></RouteLayout>} />
        <Route path='/event-listings' element={<RouteLayout><EventListings /></RouteLayout>} />
        <Route path='pay/:id/:title' element={<RouteLayout><Pay /></RouteLayout>} />
        {/* auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />

        {/* invalid Routes */}
        <Route  path='*' element={<RouteLayout><NotFound /></RouteLayout>} />


      </Routes>
  </Router>


 </ div>
  )
}

export default App