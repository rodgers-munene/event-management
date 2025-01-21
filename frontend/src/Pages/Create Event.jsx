import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDescription: '',
    eventStartDate: '',
    eventEndDate: '',
    eventLocation: '',
    eventPrice: '',
    image: '',
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // For handling loading state
  const [successMessage, setSuccessMessage] = useState(false);  // For displaying success message
  const [showPopup, setShowPopup] = useState(false); // Popup state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.user.id); // Extract the user's id
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);  // Set loading state to true
    // Prepare the data to send to the backend
    const requestBody = {
      user_id: userId,
      event_title: formData.eventTitle,
      event_description: formData.eventDescription,
      event_start_date: formData.eventStartDate,
      event_end_date: formData.eventEndDate,
      event_location: formData.eventLocation,
      event_price: formData.eventPrice,
      image_url: formData.image,
    };
    console.log(requestBody);

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Set Content-Type for JSON
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSuccessMessage(true);

        setTimeout(() => {
          window.location.href = '/event-listings'; // Redirect to event listing
          setSuccessMessage(false);
        }, 2000);
      } else {
        setError('Failed to create event. Please try again!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
    setLoading(false);  // Reset loading state
  };

  const handlePopupConfirm = (e) => {
    setShowPopup(false);
    handleSubmit(e);
  };

  return (
    <div className="w-screen flex justify-center">
      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 fixed top-0"
          role="alert"
        >
          <p>Event created successfully!</p>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">Are you sure you want to create this event?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupConfirm}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen w-80 sm:w-[30rem] flex flex-col bg-gray-100 dark:bg-gray-700 dark:text-white">
        {/* Header */}
        <header className="shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Gift className="w-6 h-6" />
              <span className="font-semibold text-xl">EventPro</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <h2 className="text-2xl sm:text-4xl font-bold mb-8">Create New Event</h2>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowPopup(true);
            }}
            className="space-y-6"
          >
            {/* Event Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Event Title</label>
              <input
                type="text"
                placeholder="Enter event title"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Event Description</label>
              <textarea
                placeholder="Enter event description"
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                placeholder="5000"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventPrice}
                onChange={(e) => setFormData({ ...formData, eventPrice: e.target.value })}
              />
            </div>

            {/* Dates */}
            <div className="space-y-2 flex w-full justify-between items-end">
              <div className="w-full">
                <label className="block text-sm font-medium">Start Date and Time</label>
                <input
                  type="date"
                  className="w-[90%] sm:w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={formData.eventStartDate}
                  onChange={(e) => setFormData({ ...formData, eventStartDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date and Time</label>
                <input
                  type="date"
                  className="w-[90%] sm:w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={formData.eventEndDate}
                  onChange={(e) => setFormData({ ...formData, eventEndDate: e.target.value })}
                />
              </div>
            </div>

            {/* Event Location */}
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                placeholder="Enter event location"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventLocation}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium">Upload Image Url</label>
              <input
                type="text"
                placeholder="Enter event image url"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Save Event'}
            </button>
          </form>
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">© 2025 EventPro. All rights reserved.</p>
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
    </div>
  );
};

export default CreateEvent;
