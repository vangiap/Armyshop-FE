import React from 'react';
import { Facebook, MessageCircle, Video } from 'lucide-react';

const SocialFloating: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
      {/* Zalo - Sử dụng màu xanh dương đậm đặc trưng */}
      <a
        href="#"
        className="group relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        title="Chat Zalo"
      >
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat Zalo
        </span>
        <div className="text-white font-bold text-xs flex flex-col items-center leading-none">
          <span>Zalo</span>
        </div>
      </a>

      {/* Facebook - Màu xanh FB */}
      <a
        href="#"
        className="group relative flex items-center justify-center w-12 h-12 bg-[#1877F2] rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        title="Facebook Messenger"
      >
         <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Facebook
        </span>
        <Facebook className="w-6 h-6 text-white" fill="currentColor" />
      </a>

      {/* TikTok - Màu đen */}
      <a
        href="#"
        className="group relative flex items-center justify-center w-12 h-12 bg-black rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        title="Xem TikTok"
      >
         <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          TikTok
        </span>
        <Video className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default SocialFloating;