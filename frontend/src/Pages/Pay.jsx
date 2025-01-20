import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import img9 from'../assets/images/9.jpg'
import img5 from'../assets/images/5.jpg'
import img7 from'../assets/images/7.jpg'

const Pay = () => {
      const {id} = useParams();
      const events = [
          {
            id: 1,
            title: "Summer Music Fest",
            date: "August 15, 2023",
            description: "Join us for an unforgettable night of music and fun at the annual Summer Music Fest.",
            image: img5,
            location: "Location: Madison Square Garden, New York",
            price: "$200",
            time: "8:00am-5:00pm"
          },
          {
            id: 2,
            title: "Gourmet Food Expo",
            date: "September 10, 2023",
            description: "Explore the latest trends in gourmet cuisine at the Gourmet Food Expo.",
            image: img7,
            location: "Location: San Francisco, California",
            price: "$150",
            time: "8:00am-5:00pm"
          },
          {
            id: 3,
            title: "Tech Innovators Conference",
            date: "October 5, 2023",
            description: "Discover the future of technology at the Tech Innovators Conference.",
            image: img9,
            location: "Location: Seattle, Washington",
            price: "$250",
            time: "8:00am-5:00pm"
          }
        ]

        const eventDetail = events.find((event) => event.id === parseInt(id));
  
        if(!eventDetail) {
          return <Error message="Event not found" />;
        }
        
        const [formData, setFormData] = useState({
        name: '',
        amount: eventDetail.price,
        phone: '+254'
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
      };

    
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 w-screen">
          {/* Navigation */}
          <nav className="bg-gray-300 dark:bg-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
           
              </div>
            </div>
          </nav>
    
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar */}
              <div className="w-full md:w-1/3">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
                  <h2 className="text-xl font-bold mb-4">Event Summary</h2>
                  <h3 className="text-lg font-semibold">{eventDetail.title}</h3>
                  <div className="space-y-2 mt-2 text-gray-700 dark:text-gray-100">
                    <p>{eventDetail.date}</p>
                    <p>{eventDetail.location}</p>
                    <p>T{eventDetail.time}</p>
                  </div>
                </div>
                
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Total Cost</h2>
                  <p className="text-xl mt-2 text-gray-700 dark:text-gray-100">{eventDetail.price}</p>
                </div>
              </div>
    
              {/* Right Content */}
              <div className="w-full md:w-2/3">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                        value={formData.amount}
                        readOnly
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="+254..."
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
    
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
                    >
                      Submit Payment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
    
          {/* Footer */}
          <footer className="bg-gray-900 dark:bg-gray-300 mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-gray-100 dark:text-gray-700">About Us</h3>
                  <p className="text-gray-300 dark:text-gray-500">
                    EventPro is your go-to solution for seamless event planning. We offer a range of features to make managing your events easier and more efficient.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4 text-gray-100 dark:text-gray-700">Contact Us</h3>
                  <div className="text-gray-300 dark:text-gray-500">
                    <p>Email: support@eventpro.com</p>
                    <p>Phone: +1 234 567 890</p>
                  </div>
                </div>
    
                <div>
                  <h3 className="font-semibold mb-4 text-gray-100 dark:text-gray-700">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 dark:text-gray-500 hover:text-gray-600">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-300 dark:text-gray-500 hover:text-gray-600">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-300 dark:text-gray-500 hover:text-gray-600">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    };
    
   


export default Pay