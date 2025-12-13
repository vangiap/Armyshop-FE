import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Helper to get full image URL
const getImageUrl = (path: string | null): string => {
  if (!path) return 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2000&q=80';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

interface PromoBannerData {
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

const PromoBanner = () => {
  const [banner, setBanner] = useState<PromoBannerData | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await api.getPromoBanners();
        if (data && data.length > 0) {
          setBanner(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch promo banner:', error);
      }
    };
    fetchBanner();
  }, []);

  const handleClick = () => {
    if (banner?.link) {
      if (banner.link.startsWith('http')) {
        window.open(banner.link, '_blank');
      } else {
        window.location.href = banner.link;
      }
    } else {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Default content if no banner from API
  const title = banner?.title || 'Siêu Sale Mùa Hè';
  const subtitle = banner?.subtitle || 'Cập nhật tủ đồ của bạn với những bộ sưu tập mới nhất.';
  const image = getImageUrl(banner?.image || null);
  const linkText = banner?.link_text || 'Mua Ngay Kẻo Lỡ';
  const textColor = banner?.text_color || '#ffffff';
  const overlayColor = banner?.overlay_color || '#000000';
  const overlayOpacity = (banner?.overlay_opacity ?? 60) / 100;

  return (
    <div className="my-16 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl overflow-hidden relative bg-gray-900 text-white shadow-2xl">
      <div className="absolute inset-0">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        ></div>
      </div>
      <div 
        className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col items-center text-center max-w-3xl mx-auto"
        style={{ color: textColor }}
      >
        <div className="inline-flex items-center px-4 py-1 rounded-full bg-red-600 text-white text-sm font-bold mb-6 animate-pulse">
          <Timer className="w-4 h-4 mr-2" /> Ưu đãi có hạn
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          {title.includes('50%') || title.includes('Sale') ? (
            <>
              {title.split(/(\d+%)/)[0]}
              {title.match(/\d+%/) && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  {title.match(/\d+%/)?.[0]}
                </span>
              )}
              {title.split(/\d+%/)[1] || ''}
            </>
          ) : (
            title
          )}
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
          {subtitle}
        </p>
        <button 
          onClick={handleClick}
          className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
        >
          {linkText}
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;