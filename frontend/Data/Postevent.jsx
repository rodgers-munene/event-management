import React, { useEffect, useState } from 'react';

import BASE_URL from './api';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/events`)
      .then((response) => {
        setEvents(response.data); // Update state with events
      })
      .catch((error) => {
        console.error('Error fetching events:', error.message);
      });
  }, []);

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.event_title} - {event.event_location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
