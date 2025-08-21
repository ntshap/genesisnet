import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Download,
  FileCheck
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationCenter = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification, 
    clearAllNotifications,
    getUnreadCount
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = getUnreadCount();

  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notification-center') && !event.target.closest('.notification-bell')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all as read when opening
      setTimeout(() => {
        markAllAsRead();
      }, 2000);
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification.severity) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        if (notification.category === 'download') {
          return <Download className="w-5 h-5 text-purple-500" />;
        } else if (notification.category === 'transaction') {
          return <FileCheck className="w-5 h-5 text-blue-500" />;
        }
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button 
        className="notification-bell relative p-2 rounded-lg hover:bg-purple-100"
        onClick={toggleNotificationCenter}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Panel */}
      {isOpen && (
        <div className="notification-center absolute top-full right-0 mt-2 w-80 max-h-96 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
          {/* Header */}
          <div className="bg-purple-200 border-b-4 border-black p-3 flex justify-between items-center">
            <h3 className="font-bold text-black">Notifications</h3>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="text-xs font-bold px-2 py-1 bg-white border-2 border-black rounded-lg hover:bg-gray-100"
                >
                  Clear All
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-purple-300 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No notifications</p>
              </div>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`border-b border-gray-200 last:border-0 p-3 ${
                      !notification.read ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-3">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold">{notification.title}</h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        {notification.action && (
                          <button
                            className="mt-2 text-xs font-bold text-purple-600 hover:underline"
                            onClick={() => {
                              notification.action.onClick();
                              dismissNotification(notification.id);
                            }}
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                      <button
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
