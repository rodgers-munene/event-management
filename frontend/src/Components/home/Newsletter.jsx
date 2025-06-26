import React from 'react'
import img9 from "../../assets/images/9.jpg";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";



const Newsletter = () => {
  const { token } = useAuth()
  const navigate = useNavigate();
  
  const handleClick = () => {
      navigate("/login");
    };
    
    const handleUpdates = () => {
      // receive update logic should be placed here
    };
  
  return (
    <div className="w-full flex justify-center py-5 bg-gray-200 dark:bg-gray-800">
        <div className="w-full sm:w-[97%] flex justify-between p-2 rounded-lg bg-gray-300 dark:bg-gray-900 shadow-xl ms-center flex-col bg md:flex-row sm:p-8">
          <div className="md:w-[45%]">
            <h2 className="mb-6 text-xl font-bold sm:text-3xl ">
              {token === null? "Join EventPro Today!" : "Enter Email to Receive updates"}
            </h2>
            <p className="mb-8 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              {token === null? `Sign up now to start planning your events with ease and
              efficiency. Don't miss out on our exclusive features designed to
              make your event a success.` : `Stay in the loop! Enter your email to get 
              the latest event updates, reminders, and exclusive offers straight to your inbox.`}
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
                  className="w-full py-3 text-2xl text-white bg-black rounded-md text-bold"
                >
                  Sign Up
                </button>
              )}
              {token !== null && (
                <button
                  onClick={handleUpdates}
                  className="w-full py-3 text-white bg-black rounded-md text-bold sm:text-2xl"
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
      </div>
  )
}

export default Newsletter