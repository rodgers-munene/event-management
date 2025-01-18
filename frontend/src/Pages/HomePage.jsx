import React from 'react'
import img2 from '../assets/images/2.jpg'
import img9 from '../assets/images/9.jpg'
import img4 from '../assets/images/4.jpg'
import { Gift, Music, Users, Cake, Facebook, Twitter } from 'lucide-react';



const HomePage = () => {

  return (
    <div className="min-h-screen flex flex-col mr-0">
  

      {/* Hero Section */}
      <section className="relative h-[500px] bg-black ">
        <img
          src={img4}
          alt="Concert lights"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold text-center mb-6">
            Plan Your Perfect Event with EventPro
          </h1>
          <button className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-100">
            Explore Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-300 p-8 text-center rounded-lg">
              <Music className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Music Events</h3>
              <p className="text-sm text-gray-700">
                Plan and manage concerts, festivals, and music shows effortlessly.
              </p>
            </div>
            <div className="bg-gray-300 p-8 text-center rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Corporate Meetings</h3>
              <p className="text-sm text-gray-700">
                Organize corporate meetings, seminars, and business conferences.
              </p>
            </div>
            <div className="bg-gray-300 p-8 text-center rounded-lg">
              <Cake className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Private Parties</h3>
              <p className="text-sm text-gray-700">
                Effortlessly plan weddings, birthdays, and private celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={img2}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <p className="text-sm text-gray-500">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Join EventPro Today!</h2>
            <p className="text-gray-700 mb-8">
              Sign up now to start planning your events with ease and efficiency. 
              Don't miss out on our exclusive features designed to make your event a success.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800">
                Sign Up
              </button>
            </div>
          </div>
          <div>
            <img
              src={img9}
              alt="Event planning"
              className="rounded-lg shadow-lg ml-40"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">EventPro</h3>
            <p className="text-gray-400">Your go-to solution for seamless event planning.</p>
          </div>
          <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default HomePage