
import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple auth check
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center">
            <Store className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold">VietShop Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Tổng quan
            </NavLink>
            <NavLink 
                to="/admin/products" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
                <Package className="w-5 h-5 mr-3" />
                Sản phẩm
            </NavLink>
            <NavLink 
                to="/admin/orders" 
                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Đơn hàng
            </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800">
            <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            >
                <LogOut className="w-5 h-5 mr-3" />
                Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:hidden">
            <span className="font-bold text-gray-900">VietShop Admin</span>
            <button onClick={handleLogout}><LogOut className="w-5 h-5" /></button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
