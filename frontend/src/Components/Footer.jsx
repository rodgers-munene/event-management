import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='w-full  dark:text-white text-gray-900 py-12 dark:border-gray-800 transition-colors duration-300'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">EventPro</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Bringing people together through unforgettable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='w-full grid grid-cols-2 sm:grid-cols-3 gap-8'>
            <div className="space-y-4 ">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Home</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Events</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Create Event</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">GDPR</a></li>
            </ul>
          </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-800 dark:text-purple-200 text-sm">
            © {new Date().getFullYear()} EventPro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-700 dark:text-gray-300 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Accessibility</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Sitemap</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 dark:hover:text-white hover:text-gray-900 transition-colors text-sm">Careers</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;