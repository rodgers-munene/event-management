import { X, Info } from 'lucide-react';

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white border border-gray-200 rounded-xl w-full max-w-sm p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[14px] font-bold text-gray-900">Notification</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors shrink-0">
          <X size={16} />
        </button>
      </div>

      <p className="text-[13px] text-gray-500 leading-relaxed pl-6 mb-5">{message}</p>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default Popup;