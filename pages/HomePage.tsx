
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services';
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
  const [categories, setCategories] = useState<{slug: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await api.getProducts();
        setProducts(prods);
        
        // Get unique categories from products
        const uniqueCats = new Map<string, string>();
        prods.forEach(p => {
          if (p.category && !uniqueCats.has(p.category)) {
            uniqueCats.set(p.category, p.category_name || p.category.replace(/-/g, ' '));
          }
        });
        setCategories(Array.from(uniqueCats, ([slug, name]) => ({ slug, name })));
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

  // Build sections dynamically from actual product categories
  const sections = categories.map(cat => ({
    id: cat.slug,
    title: cat.name,
    description: `Khám phá các sản phẩm ${cat.name.toLowerCase()}`,
    link: `/products?category=${cat.slug}`
  }));

  return (
    <div className="pb-0 bg-white">
      <HeroSlider />
      
      <ServiceFeatures />
      
      <CategoryHighlights onSelectCategory={(cat) => navigate(`/products?category=${cat}`)} />

      {/* Loop through defined sections */}
      {sections.map((section, index) => {
        // Filter products for this section
        const allSectionProducts = products.filter(p => p.category === section.id);
        const sectionProducts = allSectionProducts.slice(0, 8);
        const hasMore = allSectionProducts.length > 8;

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
                {hasMore && (
                  <Link 
                    to={section.link} 
                    className="hidden md:flex items-center font-semibold text-primary hover:text-emerald-700 transition-colors mt-4 md:mt-0"
                  >
                    Xem tất cả ({allSectionProducts.length}) <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

              {hasMore && (
                <div className="mt-8 text-center">
                  <Link 
                    to={section.link}
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    Xem tất cả {section.title} ({allSectionProducts.length} sản phẩm)
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}

      <div id="products-section"></div> {/* Anchor for scroll */}
      
      <LatestNews />

      <FeaturedCollections />
      {/* Removed NewsletterSection */}
    </div>
  );
};

export default HomePage;
