import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

interface PopupBannerData {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  link_text?: string;
}

const PopupBanner: React.FC = () => {
  const [banner, setBanner] = useState<PopupBannerData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        // Check if popup was dismissed today
        const dismissedDate = localStorage.getItem('popup_dismissed_date');
        const today = new Date().toDateString();
        
        if (dismissedDate === today) {
          return; // Don't show popup if dismissed today
        }

        const data = await api.getPopupBanner();
        if (data) {
          setBanner(data);
          // Delay showing popup for better UX
          setTimeout(() => setIsOpen(true), 2000);
        }
      } catch (error) {
        console.error('Failed to fetch popup banner:', error);
      }
    };
    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember dismissal for today
    localStorage.setItem('popup_dismissed_date', new Date().toDateString());
  };

  const handleClick = () => {
    if (banner?.link) {
      if (banner.link.startsWith('http')) {
        window.open(banner.link, '_blank');
      } else {
        window.location.href = banner.link;
      }
    }
    handleClose();
  };

  if (!isOpen || !banner) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        {banner.image && (
          <div className="relative">
            <img
              src={getImageUrl(banner.image) || ''}
              alt={banner.title}
              className="w-full h-auto max-h-[300px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{banner.title}</h3>
          {banner.subtitle && (
            <p className="text-lg text-primary font-semibold mb-2">{banner.subtitle}</p>
          )}
          {banner.description && (
            <p className="text-gray-600 mb-4">{banner.description}</p>
          )}
          
          <div className="flex gap-3 justify-center">
            {banner.link && (
              <button
                onClick={handleClick}
                className="px-6 py-3 bg-primary hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors"
              >
                {banner.link_text || 'Xem ngay'}
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-full transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PopupBanner;
