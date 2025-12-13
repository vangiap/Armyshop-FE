
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services';
import { DashboardStats } from '../../types';
import { DollarSign, ShoppingBag, Package, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        if (err.message?.includes('401') || err.message?.includes('Unauthenticated')) {
          navigate('/admin/login');
          return;
        }
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
      <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
      <div>
        <h3 className="font-medium text-red-800">Lỗi tải dữ liệu</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    </div>
  );

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const statCards = [
    { title: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-green-500' },
    { title: 'Tổng đơn hàng', value: stats.totalOrders, icon: <ShoppingBag className="w-6 h-6 text-white" />, color: 'bg-blue-500' },
    { title: 'Tổng sản phẩm', value: stats.totalProducts, icon: <Package className="w-6 h-6 text-white" />, color: 'bg-orange-500' },
    { title: 'Tăng trưởng', value: '+12.5%', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tổng quan</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} shadow-lg mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-primary">#{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 font-bold">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'shipping' ? 'Đang giao' :
                       order.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
