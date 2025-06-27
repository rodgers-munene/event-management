import React, { useState, useEffect } from "react";
import EventCard from "../Components/EventCard";
import { fetchAllEvents } from "../../api";
import HeroSection from "../Components/home/HeroSection";
import Features from "../Components/home/Features";
import Newsletter from "../Components/home/Newsletter";
import CreateEvent from "../Components/home/CreateEvent";
import { getGlobalEvents } from "../../api";
import GlobalCard from "../Components/GlobalCard";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [global, setGlobal] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const results = await fetchAllEvents();
        const globalData = await getGlobalEvents();
        setEvents(results.data);
        setGlobal(globalData.data);
        console.log(globalData.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

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
            Events Around
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {global.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* create event */}
      <CreateEvent />

      {/* Sign Up Section */}
      <Newsletter />
    </div>
  );
};

export default HomePage;
