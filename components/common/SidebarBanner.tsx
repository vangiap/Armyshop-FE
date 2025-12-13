import React, { useState, useEffect } from 'react';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

interface SidebarBannerData {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  image_mobile?: string;
  link?: string;
  link_text?: string;
  text_color: string;
  overlay_color?: string;
  overlay_opacity: number;
}

interface SidebarBannerProps {
  className?: string;
  maxBanners?: number;
}

const SidebarBanner: React.FC<SidebarBannerProps> = ({ className = '', maxBanners = 2 }) => {
  const [banners, setBanners] = useState<SidebarBannerData[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await api.getBanners('sidebar');
        if (data && data.length > 0) {
          setBanners(data.slice(0, maxBanners));
        }
      } catch (error) {
        console.error('Failed to fetch sidebar banners:', error);
      }
    };
    fetchBanners();
  }, [maxBanners]);

  if (banners.length === 0) return null;

  const handleClick = (link?: string) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {banners.map((banner) => {
        const overlayColor = banner.overlay_color || '#000000';
        const overlayOpacity = banner.overlay_opacity / 100;

        return (
          <div
            key={banner.id}
            className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group"
            onClick={() => handleClick(banner.link)}
          >
            {/* Image */}
            <img
              src={getImageUrl(banner.image) || ''}
              alt={banner.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div
              className="absolute inset-0 transition-opacity group-hover:opacity-80"
              style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
            />

            {/* Content */}
            <div 
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{ color: banner.text_color }}
            >
              <h4 className="text-lg font-bold mb-1 drop-shadow-md">{banner.title}</h4>
              {banner.subtitle && (
                <p className="text-sm opacity-90 mb-2 drop-shadow">{banner.subtitle}</p>
              )}
              {banner.link_text && (
                <span className="inline-flex items-center text-sm font-semibold group-hover:underline">
                  {banner.link_text}
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarBanner;
