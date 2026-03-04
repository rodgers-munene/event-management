import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone,
  Ticket as TicketIcon,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { registrationsAPI, eventsAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

const TicketPage = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(false);

  useEffect(() => {
    fetchRegistrationDetails();
  }, [registrationId]);

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll create a mock registration since the API might not have a get by ID endpoint
      // In production, you'd call: await registrationsAPI.getById(registrationId);
      
      // Fetch user's registrations and find the matching one
      const response = await registrationsAPI.getUserRegistrations(user.id);
      
      if (response.data.success) {
        const foundRegistration = response.data.data.find(r => r.id === parseInt(registrationId));
        
        if (!foundRegistration) {
          toast.error('Registration not found');
          navigate('/my-registrations');
          return;
        }

        setRegistration(foundRegistration);
        setEvent(foundRegistration.event || foundRegistration);

        // If event is not included, fetch it separately
        if (!foundRegistration.event) {
          const eventResponse = await eventsAPI.getById(foundRegistration.event_id);
          if (eventResponse.data.success) {
            setEvent(eventResponse.data.data);
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load ticket';
      toast.error(errorMessage);
      navigate('/my-registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async () => {
    try {
      setTicketLoading(true);
      
      // Try to download the ticket
      try {
        const response = await registrationsAPI.getTicket(registrationId);
        
        // Create blob and download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${event.event_title}-${user.user_name}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Ticket downloaded successfully!');
      } catch (downloadError) {
        // If download fails, generate a simple ticket view and print
        toast.info('Generating ticket for download...');
        window.print();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to download ticket';
      toast.error(errorMessage);
    } finally {
      setTicketLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!event || !registration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ticket Not Found</h2>
          <Link to="/my-registrations" className="text-primary-600 hover:text-primary-700">
            ← Back to My Registrations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/my-registrations"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to My Registrations
          </Link>
        </div>

        {/* Ticket */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:border print:border-gray-300">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon className="w-6 h-6" />
                  <span className="text-sm font-medium opacity-90">EVENT TICKET</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.event_title}</h1>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <CheckCircle className="w-4 h-4" />
                  <span className="capitalize">{registration.status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">#{String(registrationId).padStart(6, '0')}</p>
                <p className="text-sm opacity-90 mt-1">Ticket ID</p>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            {/* Event Image */}
            {event.image_url && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.event_title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x200?text=Event+Image';
                  }}
                />
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(event.event_start_date)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(event.event_start_date)} - {formatTime(event.event_end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.event_location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendee Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attendee</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.user_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.user_email}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Scan at Entry
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registration ID: {registrationId}
                    </p>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Need Help?
                  </p>
                  <a 
                    href={`mailto:support@eventhub.com`}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    support@eventhub.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 flex items-center justify-between print:hidden">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please present this ticket at the event entrance
            </p>
            <button
              onClick={handleDownloadTicket}
              disabled={ticketLoading}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {ticketLoading ? 'Downloading...' : 'Download Ticket'}
            </button>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
            <li>• Please arrive at least 30 minutes before the event starts</li>
            <li>• Bring a valid ID along with this ticket</li>
            <li>• This ticket is non-transferable</li>
            <li>• For cancellations, please contact the event organizer</li>
          </ul>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-3xl, .max-w-3xl * {
            visibility: visible;
          }
          .max-w-3xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketPage;
