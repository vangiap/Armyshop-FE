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
        const all = await api.getProducts();
        // Choose featured products heuristically: prefer ones with higher rating or first items
        const featured = all
          .filter(p => p.is_active !== false && p.is_visible !== false)
          .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
          .slice(0, 8);
        setProducts(featured);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || products.length === 0) return null;

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
