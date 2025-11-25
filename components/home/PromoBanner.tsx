import React from 'react';
import { Timer } from 'lucide-react';

const PromoBanner = () => (
  <div className="my-16 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl overflow-hidden relative bg-gray-900 text-white shadow-2xl">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
        alt="Sale Banner" 
        className="w-full h-full object-cover opacity-40"
      />
    </div>
    <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col items-center text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center px-4 py-1 rounded-full bg-red-600 text-white text-sm font-bold mb-6 animate-pulse">
        <Timer className="w-4 h-4 mr-2" /> Ưu đãi có hạn
      </div>
      <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
        Siêu Sale Mùa Hè <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Giảm Tới 50%</span>
      </h2>
      <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
        Cập nhật tủ đồ của bạn với những bộ sưu tập mới nhất. Áp dụng cho các sản phẩm thời trang và phụ kiện.
      </p>
      <button 
        onClick={() => document.getElementById('products-section')?.scrollIntoView({behavior: 'smooth'})}
        className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
      >
        Mua Ngay Kẻo Lỡ
      </button>
    </div>
  </div>
);

export default PromoBanner;