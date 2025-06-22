import React from 'react';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl w-[90%] max-w-md shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
              <svg 
                className="w-6 h-6 text-purple-600 dark:text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Notification</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 pl-11">
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;