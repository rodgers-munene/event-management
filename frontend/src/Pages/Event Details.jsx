import React from 'react'
import  { useState } from 'react';
import { Gift } from 'lucide-react';
import img9 from'../assets/images/9.jpg'
import img5 from'../assets/images/5.jpg'
import img7 from'../assets/images/7.jpg'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const EventDetails = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {id} = useParams();
  
  
  const events = [
    {
      id: 1,
      title: "Summer Music Fest",
      date: "August 15, 2023",
      description: "Join us for an unforgettable night of music and fun at the annual Summer Music Fest.",
      image: img5,
      location: "Location: Madison Square Garden, New York",
      price: "$200"
    },
    {
      id: 2,
      title: "Gourmet Food Expo",
      date: "September 10, 2023",
      description: "Explore the latest trends in gourmet cuisine at the Gourmet Food Expo.",
      image: img7,
      location: "Location: San Francisco, California",
      price: "$150"
    },
    {
      id: 3,
      title: "Tech Innovators Conference",
      date: "October 5, 2023",
      description: "Discover the future of technology at the Tech Innovators Conference.",
      image: img9,
      location: "Location: Seattle, Washington",
      price: "$250"
    }
  ]
  
  const eventDetail = events.find((event) => event.id === parseInt(id));

    if(!eventDetail) {
      return <Error message="Event not found" />;
    }
    
  
  return (
    <div className="min-h-screen flex flex-col">
    

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Details Section */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <div className="space-y-6">
                <img 
                  src={eventDetail.image}
                  alt="Rock concert"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-bold">{eventDetail.title}</h2>
                  <div className="text-gray-700 dark:text-gray-300 mt-2">
                    <p>{eventDetail.date}</p>
                    <p>{eventDetail.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {eventDetail.description}
                </p>
                <div className='w-full flex justify-between items-center'>
                  <button className="bg-black text-white px-4 py-2 rounded-md ">
                    Update Event
                  </button>
                  <Link 
                  to={`/pay/${id}/${eventDetail.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800'>
                    Register
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Manage Event Section */}
          <div className="md:col-span-1 ">
            <section className=" rounded-lg shadow p-6 bg-gray-200 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4">Manage Event</h2>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                Delete Event
              </button>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-gray-800 dark:bg-gray-200 rounded-lg">
                  <p className="text-white dark:text-black mb-4">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      onClick={() => {
                        // Handle delete
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Confirm Delete
                    </button>
                    <button
                      className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-300 dark:text-black text-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-gray-900">
            © 2023 EventPro. All rights reserved.
          </p>
          <div className="space-x-6">
            <a href="#" className="text-sm text-gray-400 dark:text-gray-900 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 dark:text-gray-900 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 dark:text-gray-900 hover:text-gray-900">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};





export default EventDetails