import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryHighlightsProps {
  onSelectCategory: (cat: string) => void;
}

const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ onSelectCategory }) => {
  const categories = [
    { id: 'thoi-trang-nam', name: 'Thời Trang Nam', img: 'https://images.unsplash.com/photo-1488161628813-994252600322?auto=format&fit=crop&w=600&q=80' },
    { id: 'thoi-trang-nu', name: 'Thời Trang Nữ', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' },
    { id: 'dien-tu', name: 'Đồ Điện Tử', img: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=600&q=80' },
    { id: 'trang-suc', name: 'Trang Sức', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{cat.name}</h3>
                <span className="text-sm text-gray-200 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                  Xem ngay <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryHighlights;