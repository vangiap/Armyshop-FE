import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

interface CategoryHighlightsProps {
  onSelectCategory: (cat: string) => void;
}

// Default images for categories without images
const defaultImages = [
  'https://images.unsplash.com/photo-1488161628813-994252600322?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
];

// Helper to get full image URL
const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Try to get featured categories first
        const data = await api.getFeaturedCategories();
        if (data.length > 0) {
          setCategories(data.slice(0, 4));
        } else {
          // Fallback to regular categories sorted by products count
          const allCats = await api.getCategories();
          const sorted = [...allCats].sort((a, b) => (b.products_count || 0) - (a.products_count || 0));
          setCategories(sorted.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={getImageUrl(cat.image) || defaultImages[index % defaultImages.length]} 
                alt={cat.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{cat.name}</h3>
                {cat.products_count !== undefined && cat.products_count > 0 && (
                  <span className="text-sm text-gray-300">{cat.products_count} sản phẩm nổi bật</span>
                )}
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