import React from 'react';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notification</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">
          <p className="text-center">{message}</p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white py-2 px-6 rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
