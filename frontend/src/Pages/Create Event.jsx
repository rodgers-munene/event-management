import React from 'react'
import { Gift } from 'lucide-react';
import { useState } from 'react';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    image: null,
    ticketPrice: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen w-[30rem] flex flex-col bg-gray-100 dark:bg-gray-700 dark:text-white">
      {/* Header */}
      <header className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Gift className="w-6 h-6" />
            <span className="font-semibold text-xl">EventPro</span>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Save Event
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 className="text-4xl font-bold mb-8">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Event Description
            </label>
            <textarea
              placeholder="Enter event description"
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
              <label className="block text-sm font-medium">
              Price
              </label>
              <input
                type="number"
                placeholder="5000"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
              />
            </div>

          <div className="space-y-2 flex w-full justify-between items-end">
           <div>
            <label className="block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
             </div>
          </div>

          

          <div className="space-y-2 flex w-full justify-between items-end">
           <div>
            <label className="block text-sm font-medium">
                Start Time
              </label>
              <input
                type="time"
                placeholder="6:00 PM"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium">
                End Time
              </label>
              <input
                type="Time"
                placeholder="10:30 PM"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
             </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Upload Event Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer  rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    />
                  </label>
                  <p className="pl-1 text-gray-700 dark:text-gray-300">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className=" border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            © 2025 EventPro. All rights reserved.
          </p>
          <div className="space-x-6">
            <a href="#" className="ml-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900">
              Contact Us
            </a>
            <a href="#" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default CreateEvent