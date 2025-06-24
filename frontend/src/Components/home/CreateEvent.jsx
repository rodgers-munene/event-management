import React from 'react'
import event from '../../assets/images/event.png'

const CreateEvent = () => {
  return (
    <div className=' flex flex-col sm:flex-row sm:justify-around sm:items-center w-full h-auto min-h-72 bg-[#10107B]'>
        {/* image div */}
        <div className=''>
            <img 
            src={event}
            alt="event-img"
            className='w-auto'
             />
        </div>

        {/* create event */}
        <div className='w-full sm:w-1/2 flex flex-col items-center sm:items-start'>
          <h1 className='mt-3 sm:mt-0 mb-5 text-2xl font-semibold text-white'>Make your own Event</h1>
          <p className='w-2/3 my-3 text-white'>Create unforgettable experiences with personalized features, leaving a lasting impact on attendees.

</p>
          <button className='bg-[#7848F4] my-4 py-3 px-9 text-white rounded-md'>Create Event</button>
        </div>
    </div>
  )
}

export default CreateEvent