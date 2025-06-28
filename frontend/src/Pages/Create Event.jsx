import React, { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDescription: "",
    eventStartDate: "",
    eventEndDate: "",
    eventLocation: "",
    eventStartTime: '',
    eventPrice: "",
    image: "",
  });
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For handling loading state
  const [successMessage, setSuccessMessage] = useState(false); // For displaying success message
  const [showPopup, setShowPopup] = useState(false); // Popup state

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true
    // Prepare the data to send to the backend
    const requestBody = {
      user_id: user.id,
      event_title: formData.eventTitle,
      event_description: formData.eventDescription,
      event_start_date: formData.eventStartDate,
      event_end_date: formData.eventEndDate,
      event_start_time: formData.eventStartTime,
      event_location: formData.eventLocation,
      event_price: formData.eventPrice,
      image_url: formData.image,
    };
    console.log(requestBody);

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set Content-Type for JSON
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSuccessMessage(true);

        setTimeout(() => {
          window.location.href = "/event-listings"; // Redirect to event listing
          setSuccessMessage(false);
        }, 2000);
      } else {
        setError("Failed to create event. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
    setLoading(false); // Reset loading state
  };

  const handlePopupConfirm = (e) => {
    setShowPopup(false);
    handleSubmit(e);
  };

  return (
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
        <h2 className="text-2xl sm:text-4xl font-bold mb-8">
          Create New Event
        </h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.eventTitle}
              onChange={(e) =>
                setFormData({ ...formData, eventTitle: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, eventDescription: e.target.value })
              }
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              placeholder="5000"
              min={1}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.eventPrice}
              onChange={(e) =>
                setFormData({ ...formData, eventPrice: e.target.value })
              }
            />
          </div>

          {/* Dates and Times */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Start Date & Time */}
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventStartDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventStartDate: e.target.value })
                }
              />
              <label className="block text-sm font-medium mt-2">Start Time</label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventStartTime: e.target.value })
                }
              />
            </div>

            {/* End Date & Time */}
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventEndDate: e.target.value })
                }
              />
              <label className="block text-sm font-medium mt-2">End Time</label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.eventEndTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventEndTime: e.target.value })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, eventLocation: e.target.value })
              }
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium">Upload Image URL</label>
            <input
              type="text"
              placeholder="Enter event image url"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
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
    </div>
  );
};

export default CreateEvent;
