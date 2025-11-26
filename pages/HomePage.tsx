
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/fakeApi';
import { Loader2, ChevronDown, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ServiceFeatures from '../components/home/ServiceFeatures';
import CategoryHighlights from '../components/home/CategoryHighlights';
import PromoBanner from '../components/home/PromoBanner';
import NewsletterSection from '../components/home/NewsletterSection';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollections from '../components/home/FeaturedCollections'; // Import
import LatestNews from '../components/home/LatestNews'; // Import
import { useShop } from '../context/ShopContext';

const HomePage: React.FC = () => {
  const { addToCart, searchQuery, setSearchQuery } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const navigate = useNavigate();
  const productSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(prods);
        setCategories(['all', ...cats]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-0 bg-white">
      <HeroSlider />
      
      <ServiceFeatures />
      
      <FeaturedCollections /> {/* New Section */}

      <CategoryHighlights onSelectCategory={handleCategorySelect} />
      
      <PromoBanner />

      {/* Main Products Section */}
      <div id="products-section" ref={productSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Sản Phẩm Của Chúng Tôi</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-16 z-30 bg-white/95 backdrop-blur py-4 px-2 -mx-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-primary cursor-pointer text-sm font-medium transition-colors hover:bg-gray-100"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="asc">Giá: Thấp đến Cao</option>
              <option value="desc">Giá: Cao đến Thấp</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
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
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
             <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                <Search className="h-12 w-12 text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
             <p className="text-gray-500 max-w-md mx-auto">Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với lựa chọn của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa.</p>
             <button 
                onClick={() => {setSelectedCategory('all'); setSortOrder('default'); setSearchQuery('');}}
                className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
             >
                Xóa bộ lọc
             </button>
          </div>
        )}
        
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors shadow-sm">
              Xem thêm sản phẩm
            </button>
          </div>
        )}
      </div>

      <LatestNews /> {/* New Section */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
