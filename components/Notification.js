import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Notification({ message, onClose, type = 'success' }) {
  const getNotificationStyles = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600';
      case 'edit':
        return 'bg-orange-500';
      case 'success':
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${getNotificationStyles()} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
        <CheckCircleIcon className="h-5 w-5" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 