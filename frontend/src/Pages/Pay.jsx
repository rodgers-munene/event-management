import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById } from '../../api';

const Pay = () => {
      const {id} = useParams();
      const [event, setEvent] = useState(null);
      const [loading, setLoading] = useState(true);

      function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
      }
     

      useEffect(() => {
        async function loadEvent() {
          try {
            const data = await fetchEventById(id);
            setEvent(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        loadEvent();
      }, [id]);
        
        const [formData, setFormData] = useState({
        name: '',
        amount: event?.event_price,
        phone: '+254'
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
      };

    
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 w-screen">
          {/* Navigation */}
          <nav className="bg-gray-300 dark:bg-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
           
              </div>
            </div>
          </nav>
    
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar */}
              <div className="w-full md:w-1/3">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
                  <h2 className="text-xl font-bold mb-4">Event Summary</h2>
                  <h3 className="text-lg font-semibold">{event?.event_title}</h3>
                  <div className="space-y-2 mt-2 text-gray-700 dark:text-gray-100">
                    <p>Description: <br />{event?.event_description}</p>
                    <div className='w-full flex items-center justify-between'>
                      <p>Start Date: {formatDate(event?.event_start_date)}</p>
                      <p>End date {formatDate(event?.event_end_date)}</p>
                    </div>
                    <p>Location: {event?.event_location}</p>
            
                  </div>
                </div>
                
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Total Cost</h2>
                  <p className="text-xl mt-2 text-gray-700 dark:text-gray-100">{event?.event_price}</p>
                </div>
              </div>
    
              {/* Right Content */}
              <div className="w-full md:w-2/3">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                        value={formData.amount}
                        readOnly
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="+254..."
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
    
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
                    >
                      Submit Payment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
   


export default Pay