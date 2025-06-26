const BASE_URL = import.meta.env.VITE_BASE_URL
const TICKETMASTER_KEY = import.meta.env.VITE_TICKETMASTER_KEY

export async function fetchAllEvents() {
    try {
      const response = await fetch(`${BASE_URL}/events`);
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
      const response = await fetch(`${BASE_URL}/events/${eventId}`);
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

  

export const getGlobalEvents = async() => {
  // approximate users location using apio
  try {
    const locationResponse = await fetch("https://ipapi.co/json/")
    const locationData = await locationResponse.json()

    const eventResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?latlong=${locationData.latitude},${locationData.longitude}&radius=10000&unit=km&apikey=${TICKETMASTER_KEY}&size=10`)
    const eventData = await eventResponse.json()

    return { data: eventData}
    
  } catch (error) {
    console.error("Error Fetching Events by location")
  }
  
}


