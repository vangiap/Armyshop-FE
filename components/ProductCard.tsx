import React from 'react';
import { Plus, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100" onClick={() => onClick(product.id)}>
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-900 shadow-sm">
          -{Math.floor(Math.random() * 20 + 5)}%
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category.replace(/-/g, ' ')}
          </span>
        </div>
        
        <h3 
          className="text-gray-900 font-semibold text-lg leading-tight mb-2 cursor-pointer hover:text-primary line-clamp-2"
          onClick={() => onClick(product.id)}
        >
          {product.title}
        </h3>
        
        <div className="flex items-center mb-4">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating.rate}</span>
          <span className="mx-1 text-gray-300">|</span>
          <span className="text-sm text-gray-500">{product.rating.count} đánh giá</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
            <p className="text-sm text-gray-400 line-through">{formatCurrency(product.price * 1.2)}</p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Thêm vào giỏ"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;