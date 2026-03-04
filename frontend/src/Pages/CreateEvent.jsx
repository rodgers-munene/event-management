import { useState, useEffect } from "react";
import { Gift, Upload, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { eventsAPI } from "../api/index.js";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore.js";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    event_title: "",
    event_description: "",
    event_start_date: "",
    event_end_date: "",
    event_start_time: "",
    event_end_time: "",
    event_location: "",
    event_price: "",
    image_url: "",
  });

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      setEditMode(true);
      setEventId(editId);
      fetchEvent(editId);
    }
  }, [searchParams]);

  const fetchEvent = async (id) => {
    try {
      setFetchingEvent(true);
      const response = await eventsAPI.getById(id);
      
      if (response.data.success) {
        const event = response.data.data;
        
        // Check if user owns this event
        if (event.user_id !== user.id) {
          toast.error("You can only edit your own events");
          navigate("/event-listings");
          return;
        }

        // Parse dates for form
        const startDate = new Date(event.event_start_date);
        const endDate = new Date(event.event_end_date);

        setFormData({
          event_title: event.event_title || "",
          event_description: event.event_description || "",
          event_start_date: startDate.toISOString().split("T")[0],
          event_end_date: endDate.toISOString().split("T")[0],
          event_start_time: startDate.toTimeString().slice(0, 5),
          event_end_time: endDate.toTimeString().slice(0, 5),
          event_location: event.event_location || "",
          event_price: event.event_price?.toString() || "",
          image_url: event.image_url || "",
        });

        if (event.image_url) {
          setImagePreview(event.image_url);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to load event";
      toast.error(errorMessage);
      navigate("/event-listings");
    } finally {
      setFetchingEvent(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const validateForm = () => {
    if (!formData.event_title || formData.event_title.length < 3) {
      toast.error("Event title must be at least 3 characters");
      return false;
    }
    if (!formData.event_description || formData.event_description.length < 10) {
      toast.error("Event description must be at least 10 characters");
      return false;
    }
    if (!formData.event_start_date) {
      toast.error("Start date is required");
      return false;
    }
    if (!formData.event_end_date) {
      toast.error("End date is required");
      return false;
    }
    if (new Date(formData.event_start_date) > new Date(formData.event_end_date)) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!formData.event_location || formData.event_location.length < 3) {
      toast.error("Event location must be at least 3 characters");
      return false;
    }
    if (!formData.event_price || parseFloat(formData.event_price) < 0) {
      toast.error("Valid event price is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      toast.error("Please login to create an event");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Combine date and time for start and end dates
      const startDateTime = formData.event_start_date && formData.event_start_time
        ? new Date(`${formData.event_start_date}T${formData.event_start_time}`).toISOString()
        : new Date(formData.event_start_date).toISOString();

      const endDateTime = formData.event_end_date && formData.event_end_time
        ? new Date(`${formData.event_end_date}T${formData.event_end_time}`).toISOString()
        : new Date(formData.event_end_date).toISOString();

      const eventData = {
        user_id: user.id,
        event_title: formData.event_title,
        event_description: formData.event_description,
        event_start_date: startDateTime,
        event_end_date: endDateTime,
        event_location: formData.event_location,
        event_price: parseFloat(formData.event_price),
        image_url: formData.image_url || "https://via.placeholder.com/800x450?text=Event+Image",
      };

      let response;
      if (editMode && eventId) {
        response = await eventsAPI.update(eventId, eventData);
      } else {
        response = await eventsAPI.create(eventData);
      }

      if (response.data.success) {
        toast.success(editMode ? "Event updated successfully!" : "Event created successfully!");
        setTimeout(() => {
          navigate("/event-listings");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.title || "Failed to save event";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            {editMode ? "Edit Event" : "Create New Event"}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="event_title"
              placeholder="Enter event title"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              value={formData.event_title}
              onChange={handleChange}
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Description *
            </label>
            <textarea
              name="event_description"
              placeholder="Enter event description"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
              value={formData.event_description}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (KES) *
            </label>
            <input
              type="number"
              name="event_price"
              placeholder="5000"
              min={0}
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              value={formData.event_price}
              onChange={handleChange}
            />
          </div>

          {/* Dates and Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date & Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="event_start_date"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  value={formData.event_start_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="event_start_time"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  value={formData.event_start_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="event_end_date"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  value={formData.event_end_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="event_end_time"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  value={formData.event_end_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="event_location"
              placeholder="Enter event location"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              value={formData.event_location}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Event+Image";
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload image or paste URL below
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">URL</span>
                </div>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  value={formData.image_url}
                  onChange={handleChange}
                  onBlur={(e) => {
                    if (e.target.value && !imagePreview) {
                      setImagePreview(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editMode ? "Updating Event..." : "Creating Event..."}
              </span>
            ) : (
              editMode ? "Update Event" : "Create Event"
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
