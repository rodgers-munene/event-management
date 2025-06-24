import React, { useState, useEffect } from "react";
import EventCard from "../Components/EventCard";
import { fetchAllEvents } from "../../api";
import HeroSection from "../Components/home/HeroSection";
import Features from "../Components/home/Features";
import Newsletter from "../Components/home/Newsletter";
import CreateEvent from "../Components/home/CreateEvent";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [events]);


  return (
    <div className="flex flex-col w-screen min-h-screen mx-auto mr-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Upcoming events Section */}
      <section className="px-6 py-16 bg-gray-100 dark:bg-gray-700">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-black sm:text-3xl dark:text-white">
            Upcoming Events
          </h2>         
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>  
        </div>
      </section>

      {/* create event */}
      <CreateEvent />

      {/* Sign Up Section */}
      <Newsletter />
      
    </div>
  );
};

export default HomePage;
