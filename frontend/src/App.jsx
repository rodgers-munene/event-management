import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts
import RouteLayout from './Layouts/RouteLayout'

// Pages
import HomePage from './Pages/HomePage'
import CreateEvent from './Pages/CreateEvent'
import EventDetails from './Pages/EventDetails'
import EventListings from './Pages/EventListings'
import Pay from './Pages/Pay'
import ProfilePage from './Pages/Profile'
import MyRegistrations from './Pages/MyRegistrations'
import TicketPage from './Pages/Ticket'
import EventAnalytics from './Pages/EventAnalytics'
import SavedEvents from './Pages/SavedEvents'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import NotFound from './Components/NotFound'

// Components
import ProtectedRoute from './Components/ProtectedRoute'

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
        {/* Public Routes */}
        <Route path='/' element={<RouteLayout><HomePage /></RouteLayout>} />
        <Route path='/event-listings' element={<RouteLayout><EventListings /></RouteLayout>} />
        <Route path='/event-details/:id/:title' element={<RouteLayout><EventDetails /></RouteLayout>} />
        
        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />

        {/* Protected Routes */}
        <Route path='/create-event' element={
          <ProtectedRoute>
            <RouteLayout><CreateEvent /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/pay/:id/:title' element={
          <ProtectedRoute>
            <RouteLayout><Pay /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <RouteLayout><ProfilePage /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/my-registrations' element={
          <ProtectedRoute>
            <RouteLayout><MyRegistrations /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/tickets/:registrationId' element={
          <ProtectedRoute>
            <RouteLayout><TicketPage /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/analytics/:eventId' element={
          <ProtectedRoute>
            <RouteLayout><EventAnalytics /></RouteLayout>
          </ProtectedRoute>
        } />
        <Route path='/saved-events' element={
          <ProtectedRoute>
            <RouteLayout><SavedEvents /></RouteLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path='*' element={<RouteLayout><NotFound /></RouteLayout>} />
      </Routes>
      <ToastContainer
        position="top-right"
        theme="dark"
        toastClassName="rounded-xl"
        progressClassName="bg-primary-500"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  </BrowserRouter>
  )
}

export default App
