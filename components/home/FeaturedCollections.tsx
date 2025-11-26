
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Collection } from '../../types';
import { api } from '../../services/fakeApi';

const FeaturedCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await api.getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };
    fetchCollections();
  }, []);

  if (collections.length === 0) return null;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Bộ Sưu Tập Nổi Bật</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-gray-500">Khám phá các xu hướng mới nhất được tuyển chọn dành riêng cho bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col, index) => (
            <div 
              key={col.id} 
              className={`relative rounded-2xl overflow-hidden group shadow-md ${index === 0 ? 'md:col-span-2 md:row-span-2 h-80 md:h-[500px]' : 'h-60 md:h-[240px]'}`}
            >
              <img 
                src={col.image} 
                alt={col.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {col.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {col.title}
                </h3>
                <Link 
                  to={col.link}
                  className="inline-flex items-center text-white font-semibold border-b-2 border-white/30 hover:border-white pb-1 w-fit transition-all"
                >
                  Xem ngay <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollections;
