import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Phong Cách Sống Hiện Đại",
    subtitle: "Khám phá bộ sưu tập thời trang nam mới nhất",
    cta: "Mua Sắm Ngay",
    position: "center"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Công Nghệ Đỉnh Cao",
    subtitle: "Nâng tầm trải nghiệm với các thiết bị điện tử mới",
    cta: "Xem Chi Tiết",
    position: "left"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Trang Sức Tinh Tế",
    subtitle: "Quà tặng hoàn hảo cho người thương yêu",
    cta: "Khám Phá",
    position: "right"
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear transform scale-100"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(110%)' : 'scale(100%)' 
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex ${
                slide.position === 'left' ? 'justify-start' : 
                slide.position === 'right' ? 'justify-end' : 'justify-center text-center'
            }`}>
              <div className={`max-w-xl text-white ${
                  index === currentSlide ? 'animate-fade-in-up' : ''
              }`}>
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-4">
                  🔥 Bộ sưu tập mới 2024
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight shadow-sm">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className={`flex gap-4 ${slide.position === 'center' ? 'justify-center' : ''}`}>
                    <button 
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({behavior: 'smooth'})}
                        className="bg-primary hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg transform hover:-translate-y-1"
                    >
                    {slide.cta}
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white text-white px-8 py-3 rounded-full font-bold transition-all">
                    Tìm Hiểu Thêm
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
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

      {/* Dots */}
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
    </div>
  );
};

export default HeroSlider;