import { useState, useEffect } from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  description?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  type?: 'success' | 'info' | 'warning';
}

const SuccessNotification = ({
  show,
  message,
  description,
  onClose,
  autoClose = true,
  duration = 3000,
  type = 'success'
}: SuccessNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show && !isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-800',
          button: 'text-green-600 hover:text-green-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          button: 'text-blue-600 hover:text-blue-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-800',
          button: 'text-yellow-600 hover:text-yellow-800'
        };
      default:
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-800',
          button: 'text-green-600 hover:text-green-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`max-w-sm w-full border rounded-lg shadow-lg transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${styles.bg}`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === 'success' && <CheckCircle size={20} className={styles.icon} />}
              {type === 'info' && <Sparkles size={20} className={styles.icon} />}
              {type === 'warning' && <CheckCircle size={20} className={styles.icon} />}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${styles.text}`}>
                {message}
              </p>
              {description && (
                <p className={`mt-1 text-sm ${styles.text} opacity-75`}>
                  {description}
                </p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className={`inline-flex ${styles.button} transition-colors`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="h-1 bg-gray-200">
            <div
              className={`h-full transition-all ease-linear ${
                type === 'success' ? 'bg-green-500' : 
                type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{
                width: isVisible ? '0%' : '100%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessNotification;
