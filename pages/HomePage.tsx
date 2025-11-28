
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/fakeApi';
import { Loader2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ServiceFeatures from '../components/home/ServiceFeatures';
import CategoryHighlights from '../components/home/CategoryHighlights';
import PromoBanner from '../components/home/PromoBanner';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollections from '../components/home/FeaturedCollections';
import LatestNews from '../components/home/LatestNews';
import { useShop } from '../context/ShopContext';

const HomePage: React.FC = () => {
  const { addToCart } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await api.getProducts();
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  // Define the sections we want to display
  const sections = [
    {
      id: 'thoi-trang-nam',
      title: 'Thời Trang Nam',
      description: 'Phong cách lịch lãm và hiện đại dành cho phái mạnh',
      link: '/products?category=thoi-trang-nam'
    },
    {
      id: 'thoi-trang-nu',
      title: 'Thời Trang Nữ',
      description: 'Duyên dáng và sành điệu với bộ sưu tập mới nhất',
      link: '/products?category=thoi-trang-nu'
    },
    {
      id: 'dien-tu',
      title: 'Điện Tử & Công Nghệ',
      description: 'Nâng cấp cuộc sống với các thiết bị thông minh',
      link: '/products?category=dien-tu'
    },
    {
      id: 'trang-suc',
      title: 'Trang Sức Cao Cấp',
      description: 'Điểm nhấn tinh tế cho vẻ đẹp của bạn',
      link: '/products?category=trang-suc'
    }
  ];

  return (
    <div className="pb-0 bg-white">
      <HeroSlider />
      
      <ServiceFeatures />
      
      <FeaturedCollections />

      {/* Loop through defined sections */}
      {sections.map((section, index) => {
        // Filter products for this section (limit to 4)
        const sectionProducts = products.filter(p => p.category === section.id).slice(0, 4);

        if (sectionProducts.length === 0) return null;

        return (
          <React.Fragment key={section.id}>
             {/* Inject Banner after the 2nd section for visual break */}
            {index === 2 && <PromoBanner />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-100 first:border-0">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h2>
                  <p className="mt-2 text-gray-500 text-sm md:text-base">{section.description}</p>
                </div>
                <Link 
                  to={section.link} 
                  className="hidden md:flex items-center font-semibold text-primary hover:text-emerald-700 transition-colors mt-4 md:mt-0"
                >
                  Xem tất cả <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {sectionProducts.map(product => (
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

              <div className="mt-8 text-center md:hidden">
                <Link 
                  to={section.link}
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Xem tất cả {section.title}
                </Link>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div id="products-section"></div> {/* Anchor for scroll */}

      <CategoryHighlights onSelectCategory={(cat) => navigate(`/products?category=${cat}`)} />
      
      <LatestNews />
      {/* Removed NewsletterSection */}
    </div>
  );
};

export default HomePage;
