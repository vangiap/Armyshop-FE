import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isOutOfStock = product.in_stock === false || product.stock_quantity === 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Chuyển hướng đến trang chi tiết
    onClick(product.id);
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100" onClick={() => onClick(product.id)}>
        <img
          src={getImageUrl(product.image) || '/placeholder-product.jpg'}
          alt={product.title}
          className={`object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
          loading="lazy"
        />
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
            Hết hàng
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-900 shadow-sm">
            -{Math.floor(Math.random() * 20 + 5)}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category.replace(/-/g, ' ')}
          </span>
        </div>
        
        <h3 
          className="text-gray-900 font-semibold text-base leading-tight mb-2 cursor-pointer hover:text-primary line-clamp-2 min-h-[2.5rem]"
          onClick={() => onClick(product.id)}
        >
          {product.title}
        </h3>
        
        <div className="flex items-center mb-3">
          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating.rate}</span>
          <span className="mx-1 text-gray-300">|</span>
          <span className="text-xs text-gray-500">{product.rating.count} đánh giá</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline mb-3">
             <p className="text-lg font-bold text-gray-900 mr-2">{formatCurrency(product.price)}</p>
             <p className="text-xs text-gray-400 line-through">{formatCurrency(product.price * 1.2)}</p>
          </div>
          
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`w-full py-2 font-bold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
