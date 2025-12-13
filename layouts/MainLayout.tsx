
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import SocialFloating from '../components/common/SocialFloating';
import PopupBanner from '../components/common/PopupBanner';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CartSidebar />
      <SocialFloating />
      <PopupBanner />
      <Footer />
    </div>
  );
};

export default MainLayout;
