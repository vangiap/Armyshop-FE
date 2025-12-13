
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Helper to get full image URL
const getImageUrl = (path: string | null): string => {
  if (!path) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

// Default slides (fallback)
const defaultSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Phong Cách Sống Hiện Đại",
    subtitle: "Khám phá bộ sưu tập thời trang nam mới nhất",
    link: "/products",
    link_text: "Mua Sắm Ngay",
    text_color: "#ffffff",
    overlay_opacity: 40,
  },
];

interface Slide {
  id: number;
  image: string;
  image_mobile?: string;
  title: string;
  subtitle?: string;
  description?: string;
  link?: string;
  link_text?: string;
  text_color: string;
  overlay_color?: string;
  overlay_opacity: number;
}

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await api.getHeroSlider();
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleCtaClick = (link?: string) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    } else {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => {
        const overlayColor = slide.overlay_color || '#000000';
        const overlayOpacity = slide.overlay_opacity / 100;
        
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image - Desktop */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear transform scale-100 hidden md:block"
              style={{ 
                backgroundImage: `url(${getImageUrl(slide.image)})`,
                transform: index === currentSlide ? 'scale(110%)' : 'scale(100%)' 
              }}
            >
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
              ></div>
            </div>
            
            {/* Background Image - Mobile */}
            <div 
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{ 
                backgroundImage: `url(${getImageUrl(slide.image_mobile || slide.image)})`,
              }}
            >
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
              ></div>
            </div>

            {/* Content - Fixed Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex justify-center text-center">
                <div className="max-w-3xl" style={{ color: slide.text_color }}>
                  <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-4">
                    🔥 Bộ sưu tập mới 2024
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight shadow-sm">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => handleCtaClick(slide.link)}
                      className="bg-primary hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg transform hover:-translate-y-1"
                    >
                      {slide.link_text || 'Mua Sắm Ngay'}
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white text-white px-8 py-3 rounded-full font-bold transition-all">
                      Tìm Hiểu Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all hidden md:block"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all hidden md:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
