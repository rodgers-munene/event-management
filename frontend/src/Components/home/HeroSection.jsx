import React from 'react'
import Hero from "../../assets/images/hero.png";
import SearchBar from "../SearchBar";
import { useNavigate } from "react-router-dom";



const HeroSection = () => {
      const navigate = useNavigate();
    
    const handleExplore = () => {
    navigate("/event-listings");
  };
  return (
     <div className="relative flex flex-col items-center w-full h-[300px] sm:h-[500px] bg-black">
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
      </div>
  )
}

export default HeroSection