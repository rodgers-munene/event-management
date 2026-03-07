import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const LINKS = [
  {
    heading: 'Product',
    items: [
      { label: 'Home',         to: '/'               },
      { label: 'Events',       to: '/event-listings' },
      { label: 'Create Event', to: '/create-event'   },
      { label: 'Pricing',      to: '#'               },
    ],
  },
  {
    heading: 'Support',
    items: [
      { label: 'Contact Us',  to: '#' },
      { label: 'FAQs',        to: '#' },
      { label: 'Help Center', to: '#' },
      { label: 'Community',   to: '#' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy Policy',   to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Cookie Policy',    to: '#' },
      { label: 'GDPR',             to: '#' },
    ],
  },
];

const SOCIAL = [
  { label: 'Facebook',  href: '#', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Twitter',   href: '#', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
  { label: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
  { label: 'LinkedIn',  href: '#', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
];

const Footer = () => (
  <footer className="border-t border-gray-200 bg-white w-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between gap-10">

        {/* Brand */}
        <div className="shrink-0 max-w-[220px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gray-900 rounded flex items-center justify-center">
              <Calendar size={14} className="text-yellow-300" />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">EventHub</span>
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
            Bringing people together through unforgettable experiences.
          </p>
          <div className="flex gap-3">
            {SOCIAL.map(({ label, href, icon }) => (
              <a key={label} href={href} aria-label={label}
                className="text-gray-300 hover:text-gray-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
          {LINKS.map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{heading}</p>
              <ul className="space-y-2">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[12px] text-gray-400">© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        <div className="flex gap-5">
          {['Accessibility', 'Sitemap', 'Careers'].map(l => (
            <a key={l} href="#" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;