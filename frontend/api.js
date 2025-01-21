const BASE_URL = import.meta.env.VITE_BACKEND_URL; 


export async function fetchAllEvents() {
    try {
      const response = await fetch(`${BASE_URL}/api/events`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events.');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all events:', error.message);
      throw error;
    }
  }

  // Fetch a single event by ID
export async function fetchEventById(eventId) {
    try {
      const response = await fetch(`${BASE_URL}/api/events/${eventId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch event.');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error.message);
      throw error;
    }
  }

export default BASE_URL;

