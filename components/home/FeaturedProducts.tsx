import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { api } from '../../services';
import ProductCard from '../ProductCard';
import { useShop } from '../../context/ShopContext';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useShop();

  useEffect(() => {
    const load = async () => {
      try {
        // Try to get featured products from backend first
        const response: any = await api.getProducts({ featured: true, per_page: 8 } as any);
        const responseData: any[] = Array.isArray(response) ? response : (response?.data || []);
        if (responseData && responseData.length > 0) {
          setProducts(responseData.slice(0, 8));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('API featured products failed:', err);
      }

      const isFeatured = (p: any) => {
        if (!p) return false;
        const v = p.featured ?? p.is_featured ?? p.featured_flag;
        return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
      };

      // Fallback: get all products and filter client-side
      try {
        const all: any = await api.getProducts({ per_page: 50 } as any);
        const allData: any[] = Array.isArray(all) ? all : (all?.data || []);
        const featured = allData
          .filter((p: any) => isFeatured(p) && p.is_active !== false && p.is_visible !== false);
        if (featured.length > 0) {
          setProducts(featured.slice(0, 8));
          setLoading(false);
          return;
        }
      } catch (fallbackErr) {
        console.error('Client-side filter failed:', fallbackErr);
      }

      // No more fallbacks: if backend and client-side filter didn't return featured products,
      // we should not show heuristic picks to avoid displaying non-featured items.
      setProducts([]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm Nổi Bật</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm Nổi Bật</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có sản phẩm nổi bật nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm Nổi Bật</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => {
              const defaultColor = p.colors?.[0];
              const defaultSize = p.sizes?.[0];
              addToCart(p, defaultColor, defaultSize);
            }}
            onClick={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
