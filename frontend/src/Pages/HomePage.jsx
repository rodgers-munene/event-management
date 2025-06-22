import React, { useState, useEffect } from "react";
import img9 from "../assets/images/9.jpg";
import Hero from "../assets/images/hero.png";
import { useNavigate } from "react-router-dom";
import { Music, Users, Cake } from "lucide-react";
import SearchBar from "../Components/SearchBar";
import EventCard from "../Components/EventCard";
import { fetchAllEvents } from "../../api";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    navigate("/authentication");
  };
  const handleExplore = () => {
    navigate("/event-listings");
  };
  const handleUpdates = () => {
    // receive update logic should be placed here
  };
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
  }, []);


  return (
    <div className="flex flex-col w-screen min-h-screen mx-auto mr-0">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center w-full h-[300px] sm:h-[500px] bg-black">
        <img
          src={Hero}
          alt="Concert lights"
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="mb-6 text-3xl font-semibold text-center sm:text-5xl sm:font-bold">
            Plan Your Perfect Event with EventPro
          </p>
          <button
            onClick={handleExplore}
            className="px-6 py-3 font-semibold text-white transition duration-300 bg-indigo-900 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Explore Events
          </button>
        </div>

        <div className="absolute -bottom-16 sm:bottom-0">
          <SearchBar />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-200 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold  sm:text-3xl">Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-8 text-center bg-gray-300 rounded-lg dark:bg-gray-700">
              <Music className="w-8 h-8 mx-auto mb-4" />
              <h3 className="mb-2 font-semibold">Music Events</h3>
              <p className="text-sm text-gray-700 dark:text-gray-100">
                Plan and manage concerts, festivals, and music shows
                effortlessly.
              </p>
            </div>
            <div className="p-8 text-center bg-gray-300 rounded-lg dark:bg-gray-700">
              <Users className="w-8 h-8 mx-auto mb-4" />
              <h3 className="mb-2 font-semibold">Corporate Meetings</h3>
              <p className="text-sm text-gray-700 dark:text-gray-100">
                Organize corporate meetings, seminars, and business conferences.
              </p>
            </div>
            <div className="p-8 text-center bg-gray-300 rounded-lg dark:bg-gray-700">
              <Cake className="w-8 h-8 mx-auto mb-4" />
              <h3 className="mb-2 font-semibold">Private Parties</h3>
              <p className="text-sm text-gray-700 dark:text-gray-100">
                Effortlessly plan weddings, birthdays, and private celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events Section */}
      <section className="px-6 py-16 bg-gray-100 dark:bg-gray-700">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-black sm:text-3xl dark:text-white">
            Upcoming Events
          </h2>         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>  
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="px-4 py-16 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-between p-2 rounded-lg shadow-lg md:flex-row sm:p-8">
          <div className="md:w-[45%]">
            <h2 className="mb-6 text-xl font-bold sm:text-3xl ">
              Join EventPro Today!
            </h2>
            <p className="mb-8 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              Sign up now to start planning your events with ease and
              efficiency. Don't miss out on our exclusive features designed to
              make your event a success.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {token === null && (
                <button
                  onClick={handleClick}
                  className="w-full py-3 text-2xl text-white bg-black rounded-md  text-bold"
                  to={"/signup"}
                >
                  Sign Up
                </button>
              )}
              {token !== null && (
                <button
                  onClick={handleUpdates}
                  className="w-full py-3 text-white bg-black rounded-md  text-bold sm:text-2xl"
                  to={"/Auth"}
                >
                  Recieve Updates
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:w-[45%] flex justify-center">
            <img
              src={img9}
              alt="Event planning"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
