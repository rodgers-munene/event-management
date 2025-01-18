import React from 'react'
import  { useState } from 'react';
import { Gift } from 'lucide-react';
import img4 from'../assets/images/4.jpg'
const EventDetails = () => {
 
 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Details Section */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <div className="space-y-6">
                <img 
                  src={img4}
                  alt="Rock concert"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-bold">Rock the Night</h2>
                  <div className="text-gray-600 mt-2">
                    <p>Date: November 25, 2023</p>
                    <p>Location: Madison Square Garden, New York</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Experience an unforgettable night with top rock bands performing live. 
                  Join us for an evening filled with electrifying music, vibrant lights, 
                  and an amazing crowd.
                </p>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                  Update Event
                </button>
              </div>
            </section>

            {/* Payment Details Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
              <p className="text-gray-700 mb-6">
                Secure your spot by completing your payment. Choose your preferred payment method below.
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Pay Now
                  
                </button>
              </form>
            </section>
          </div>

          {/* Manage Event Section */}
          <div className="md:col-span-1">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Manage Event</h2>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                Delete Event
              </button>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 mb-4">
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
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
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
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2023 EventPro. All rights reserved.
          </p>
          <div className="space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};





export default EventDetails