import React, { useState } from 'react';

const CreateEvent = ({ onEventCreate }) => {
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

    // Create a new event object
    const newEvent = {
      id: Date.now(),  // Unique ID based on timestamp
      title: formData.title,
      description: formData.description,
      date: `${formData.startDate} - ${formData.endDate}`,
      image: URL.createObjectURL(formData.image), // For the image preview
      ticketPrice: formData.ticketPrice
    };

    // Pass the new event data to the parent component
    onEventCreate(newEvent);

    // Reset form fields after submission
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      image: null,
      ticketPrice: ''
    });
  };

  return (
    <div className="min-h-screen w-[30rem] flex flex-col bg-gray-100 dark:bg-gray-700 dark:text-white">
      <header className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xl">EventPro</span>
          </div>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleSubmit}
          >
            Save Event
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 className="text-4xl font-bold mb-8">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields for event creation */}
          {/* Include form fields here, similar to your original code */}
          <input
            type="text"
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {/* ...other form fields... */}
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
