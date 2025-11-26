
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage'; // Import
import BlogPostPage from './pages/BlogPostPage'; // Import
import Footer from './components/Footer';
import SocialFloating from './components/common/SocialFloating';
import { ShopProvider } from './context/ShopContext';

const App: React.FC = () => {
  return (
    <ShopProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
            </Routes>
          </main>

          <CartSidebar />
          <SocialFloating />
          <Footer />
        </div>
      </HashRouter>
    </ShopProvider>
  );
};

export default App;
