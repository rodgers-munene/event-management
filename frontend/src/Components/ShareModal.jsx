import { useState } from 'react';
import { X, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, MessageCircle, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, event }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`Check out this amazing event: ${event.event_title}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(event.event_title)}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(event.event_title)}&body=${shareText}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Share Event
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Event Info */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {event.event_title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(event.event_start_date).toLocaleDateString()} • {event.event_location}
          </p>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <ShareButton
            icon={Facebook}
            label="Facebook"
            color="hover:bg-blue-600 hover:text-white"
            onClick={() => handleShare('facebook')}
          />
          <ShareButton
            icon={Twitter}
            label="Twitter"
            color="hover:bg-sky-500 hover:text-white"
            onClick={() => handleShare('twitter')}
          />
          <ShareButton
            icon={Linkedin}
            label="LinkedIn"
            color="hover:bg-blue-700 hover:text-white"
            onClick={() => handleShare('linkedin')}
          />
          <ShareButton
            icon={MessageCircle}
            label="WhatsApp"
            color="hover:bg-green-600 hover:text-white"
            onClick={() => handleShare('whatsapp')}
          />
          <ShareButton
            icon={Mail}
            label="Email"
            color="hover:bg-purple-600 hover:text-white"
            onClick={() => handleShare('email')}
          />
          <ShareButton
            icon={copied ? Check : LinkIcon}
            label={copied ? 'Copied!' : 'Copy Link'}
            color="hover:bg-gray-700 hover:text-white"
            onClick={handleCopyLink}
            isCopied={copied}
          />
        </div>

        {/* Direct Link */}
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-400 truncate focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareButton = ({ icon: Icon, label, color, onClick, isCopied }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all ${color}`}
    >
      <Icon className={`w-6 h-6 ${isCopied ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`} />
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </button>
  );
};

export default ShareModal;
