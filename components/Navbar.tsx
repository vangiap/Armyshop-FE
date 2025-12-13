import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Store, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services';
import { Category } from '../types';

const Navbar: React.FC = () => {
  const { cartItems, toggleCart, setSearchQuery } = useShop();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // For mobile
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const isActive = (path: string) => {
      if (path === '/' && location.pathname !== '/') return false;
      if (path === '/blog' && location.pathname.startsWith('/blog')) return true;
      return location.pathname === path;
  };

  const handleCategoryClick = (cat: Category) => {
      setIsMenuOpen(false);
      navigate(`/products?category=${cat.slug}`);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt={settings.site_name} className="h-8" />
            ) : (
              <Store className="h-8 w-8 text-primary" />
            )}
            <span className="ml-2 text-2xl font-bold text-gray-900 tracking-tight">{settings.site_name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center h-full">
            <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-gray-700'
                }`}
            >
                Trang chủ
            </Link>

            {/* Product Dropdown */}
            <div className="relative group h-full flex items-center">
                <Link
                    to="/products"
                    className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/products') ? 'text-primary' : 'text-gray-700'
                    }`}
                >
                    Sản phẩm <ChevronDown className="w-4 h-4 ml-1" />
                </Link>
                
                {/* Mega Menu / Dropdown */}
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-lg rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                        <Link 
                            to="/products" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-b border-gray-50"
                        >
                            Tất cả sản phẩm
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/products?category=${cat.slug}`}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

             <Link
                to="/blog"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/blog') ? 'text-primary' : 'text-gray-700'
                }`}
            >
                Tin tức
            </Link>

            <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/about') ? 'text-primary' : 'text-gray-700'
                }`}
            >
                Giới thiệu
            </Link>
            <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/contact') ? 'text-primary' : 'text-gray-700'
                }`}
            >
                Liên hệ
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition duration-150 ease-in-out"
                placeholder="Tìm sản phẩm..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:hidden"
            >
               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary focus:outline-none transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-50 shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
             {/* Mobile Search */}
             <div className="mb-4 mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  placeholder="Tìm kiếm..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
                Trang chủ
            </Link>

            {/* Mobile Product Accordion */}
            <div>
                <button 
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                    Sản phẩm
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProductDropdownOpen && (
                    <div className="pl-4 space-y-1 bg-gray-50 rounded-lg mt-1 mb-2 py-2">
                        <Link
                            to="/products"
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Tất cả sản phẩm
                        </Link>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-primary"
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
                Tin tức
            </Link>

            <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
                Giới thiệu
            </Link>
            <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
            >
                Liên hệ
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;