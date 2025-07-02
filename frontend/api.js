const BASE_URL = import.meta.env.VITE_BASE_URL

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
        throw new Error(errorData.message || 'Failed to fetch event.');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      throw error;
    }
  }

export const userEvents = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${userId}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(!response.ok){
     const errorData = await response.json();
     throw new Error(errorData || "Failed to fetch user events")
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.error(`Error fetching user events with ID ${userId}:`, error);
    return[]
  }
}

export const updateUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`)
  }catch(err){

  }
}


