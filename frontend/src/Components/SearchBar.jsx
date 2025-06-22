import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const SearchBar = () => {
  return (
    <div className="w-[95vw] sm:w-[80vw] mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {/* What */}
          <div className="w-full p-4">
            <div className="flex items-center">
              <FiSearch className="text-gray-500 dark:text-gray-400 mr-3 text-xl" />
              <input
                type="text"
                placeholder="Looking for..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              />
            </div>
          </div>
          
          {/* Where */}
          <div className="w-full p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FiMapPin className="text-gray-500 dark:text-gray-400 mr-3 text-xl" />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              />
            </div>
            <button className="">
                <FaMagnifyingGlass className='text-purple-600' />
              </button>
          </div>
    
        </div>
      </div>
    </div>
  );
};

export default SearchBar;