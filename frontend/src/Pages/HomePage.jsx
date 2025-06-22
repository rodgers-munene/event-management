import React, { useState, useEffect } from 'react'
import img2 from '../assets/images/2.jpg'
import img9 from '../assets/images/9.jpg'
import img4 from '../assets/images/4.jpg'
import { useNavigate } from 'react-router-dom'
import { Gift, Music, Users, Cake, Facebook, Twitter } from 'lucide-react';




const HomePage = () => {
  const[loggedIn, setLoggedIn] = useState(false);
  const[user, setUser] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/authentication');
  };
  const handleExplore = ()  => {
    navigate('/event-listings');
  }
  const handleUpdates = () => {
    // receive update logic should be placed here
  }

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('user'));
      if (storedData) {
        // setUser(storedData.user.name);
        setLoggedIn(true);
      }
  }, []);

  return (
    <div className="flex flex-col w-screen min-h-screen mx-auto mr-0">
  

      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[500px] bg-black">
        <img
          src={img4}
          alt="Concert lights"
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="mb-6 text-3xl font-semibold text-center sm:text-5xl sm:font-bold">
            Plan Your Perfect Event with EventPro
          </p>
          <button
             onClick={handleExplore}
             className="px-6 py-3 font-semibold text-white transition duration-300 bg-indigo-900 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-gray-300">
            Explore Events
          </button>
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
                Plan and manage concerts, festivals, and music shows effortlessly.
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

      {/* Testimonials Section */}
      <section className="px-6 py-16 bg-gray-100 dark:bg-gray-700">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-black sm:text-3xl dark:text-white">What Our Users Say</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Amad Diallo.",
                quote: "EventPro made planning our wedding so easy and stress-free!",
              },
              {
                name: "John D.",
                quote: "Seamless integration and incredible support from the team!",
              },
              {
                name: "Sherehe Sheria.",
                quote: "Our festival was a hit thanks to EventPro's comprehensive tools!",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 text-center bg-gray-300 rounded-lg shadow-lg dark:bg-gray-600">
                <div className="w-16 h-16 mx-auto mb-4 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-900">
                  <img
                    src={img2}
                    alt={testimonial.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-100">"{testimonial.quote}"</p>
                <p className="text-sm text-gray-900 dark:text-gray-300">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="px-4 py-16 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-between p-2 rounded-lg shadow-lg md:flex-row sm:p-8">
          <div className='md:w-[45%]'>
            <h2 className="mb-6 text-xl font-bold sm:text-3xl ">Join EventPro Today!</h2>
            <p className="mb-8 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              Sign up now to start planning your events with ease and efficiency. 
              Don't miss out on our exclusive features designed to make your event a success.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {!loggedIn && (
                <button 
                onClick={handleClick}
                className="w-full py-3 text-2xl text-white bg-black rounded-md  text-bold" to={'/Auth'}>
                Sign Up

              </button>
              )}
              {loggedIn && (
                <button 
                onClick={handleUpdates}
                className="w-full py-3 text-white bg-black rounded-md  text-bold sm:text-2xl" to={'/Auth'}>
                Recieve Updates
                </button>
              )}

            </div>
          </div>
          <div className='mt-6 md:mt-0 md:w-[45%] flex justify-center'>
            <img
              src={img9}
              alt="Event planning"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-white bg-gray-900  dark:bg-gray-300 dark:text-black">
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xl font-bold">EventPro</h3>
            <p className="text-gray-400 dark:text-gray-900">Your go-to solution for seamless event planning.</p>
          </div>
          <div className="flex flex-col items-start space-y-4 md:flex-row md:justify-end md:items-center md:space-y-0 md:space-x-6">
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 sm:text-base dark:text-gray-900 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 sm:text-base dark:text-gray-900 hover:text-white">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 sm:text-base dark:text-gray-900 hover:text-white">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default HomePage