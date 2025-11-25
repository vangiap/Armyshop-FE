import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import Footer from './components/Footer';
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
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>

          <CartSidebar />
          <Footer />
        </div>
      </HashRouter>
    </ShopProvider>
  );
};

export default App;