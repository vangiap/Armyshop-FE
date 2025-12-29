import React from 'react';
import { Facebook, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SocialFloating: React.FC = () => {
  const { settings } = useSettings();

  // Check if any social link is configured
  const hasAnySocial = settings.social_zalo || settings.social_facebook || settings.social_tiktok || settings.contact_hotline || settings.contact_phone;

  if (!hasAnySocial) return null;

  return (
    <div className="fixed bottom-16 md:bottom-24 right-2 md:right-4 z-40 flex flex-col gap-2 md:gap-3">
      {/* Hotline/Phone */}
      {(settings.contact_hotline || settings.contact_phone) && (
        <a
          href={`tel:${(settings.contact_hotline || settings.contact_phone).replace(/\s/g, '')}`}
          className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          title="Gọi ngay"
        >
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {settings.contact_hotline || settings.contact_phone}
          </span>
          <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </a>
      )}

      {/* Zalo */}
      {settings.social_zalo && (
        <a
          href={settings.social_zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          title="Chat Zalo"
        >
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat Zalo
          </span>
          <div className="text-white font-bold text-[10px] md:text-xs flex flex-col items-center leading-none">
            <span>Zalo</span>
          </div>
        </a>
      )}

      {/* Facebook */}
      {settings.social_facebook && (
        <a
          href={settings.social_facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#1877F2] rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          title="Facebook"
        >
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Facebook
          </span>
          <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
        </a>
      )}

      {/* TikTok */}
      {settings.social_tiktok && (
        <a
          href={settings.social_tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          title="TikTok"
        >
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            TikTok
          </span>
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

export default SocialFloating;