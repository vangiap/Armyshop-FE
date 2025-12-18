
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { api } from '../services';
import { Loader2, Filter, X, ChevronDown, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SidebarBanner from '../components/common/SidebarBanner';
import { useShop } from '../context/ShopContext';

const ProductsPage: React.FC = () => {
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Data State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  
  // UI State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync selectedCategory from URL when searchParams changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts({ per_page: 200 }),
          api.getCategories()
        ]);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // (URL updates are handled explicitly via `changeCategory` to avoid loops)

  // Filtering Logic
  const filteredProducts = allProducts.filter(product => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

    // 2. Price Filter
    if (priceRange !== 'all') {
      if (priceRange === 'under-500') {
        if (product.price >= 500000) return false;
      } else if (priceRange === '500-2000') {
        if (product.price < 500000 || product.price > 2000000) return false;
      } else if (priceRange === 'over-2000') {
        if (product.price <= 2000000) return false;
      }
    }

    // 3. Rating Filter
    if (minRating > 0 && product.rating.rate < minRating) return false;

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (product: Product) => {
    const defaultColor = product.colors?.[0];
    const defaultSize = product.sizes?.[0];
    addToCart(product, defaultColor, defaultSize);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Sản phẩm' }]} />

      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Tất cả sản phẩm</h1>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button 
            className="md:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="w-4 h-4 mr-2" /> Bộ lọc
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full md:w-48 appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="default">Mới nhất</option>
              <option value="asc">Giá: Thấp đến Cao</option>
              <option value="desc">Giá: Cao đến Thấp</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Sidebar Filters */}
        <div className={`
          lg:w-1/4 flex-shrink-0 
          ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}
        `}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold">Bộ lọc tìm kiếm</h2>
            <button onClick={() => setShowMobileFilters(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:p-6 space-y-8">
            
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Danh mục</h3>
              <div className="space-y-3">
                {/* All Products option */}
                <div className="flex items-center">
                  <input
                    id="cat-all"
                    name="category"
                    type="radio"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="cat-all" className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-primary">
                    Tất cả sản phẩm
                  </label>
                </div>
                {/* Category options */}
                {categories.map(cat => (
                  <div key={cat.slug} className="flex items-center">
                    <input
                      id={`cat-${cat.slug}`}
                      name="category"
                      type="radio"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`cat-${cat.slug}`} className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-primary">
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Khoảng giá</h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under-500', label: 'Dưới 500.000đ' },
                  { id: '500-2000', label: '500.000đ - 2.000.000đ' },
                  { id: 'over-2000', label: 'Trên 2.000.000đ' },
                ].map((price) => (
                  <div key={price.id} className="flex items-center">
                    <input
                      id={`price-${price.id}`}
                      name="price-range"
                      type="radio"
                      checked={priceRange === price.id}
                      onChange={() => setPriceRange(price.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`price-${price.id}`} className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-primary">
                      {price.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Đánh giá</h3>
              <div className="space-y-3">
                {[5, 4, 3].map((star) => (
                  <div key={star} className="flex items-center cursor-pointer" onClick={() => setMinRating(star)}>
                     <input
                      id={`rating-${star}`}
                      name="rating"
                      type="radio"
                      checked={minRating === star}
                      onChange={() => setMinRating(star)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`rating-${star}`} className="ml-3 flex items-center text-sm text-gray-600 cursor-pointer">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span>trở lên</span>
                    </label>
                  </div>
                ))}
                <div className="flex items-center cursor-pointer" onClick={() => setMinRating(0)}>
                     <input
                      id="rating-all"
                      name="rating"
                      type="radio"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="rating-all" className="ml-3 text-sm text-gray-600">Tất cả đánh giá</label>
                </div>
              </div>
            </div>
            
            {/* Clear Filter Button */}
            <button
                onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setMinRating(0);
                    setShowMobileFilters(false);
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                Xóa bộ lọc
            </button>
          </div>

          {/* Sidebar Banners */}
          <SidebarBanner className="mt-6 hidden lg:block" maxBanners={2} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-500">
             Hiển thị <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm phù hợp
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onClick={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 border-dashed rounded-xl">
               <div className="p-4 bg-gray-50 rounded-full mb-4">
                 <Filter className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
               <p className="text-gray-500 text-center max-w-xs mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
               <button 
                 onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setMinRating(0);
                 }}
                 className="text-primary font-medium hover:underline"
               >
                 Xóa tất cả bộ lọc
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
