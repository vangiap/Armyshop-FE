
import React, { useEffect, useState } from 'react';
import { api } from '../../services/fakeApi';
import { Order } from '../../types';
import { Eye, Search } from 'lucide-react';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between">
             <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm mã đơn hàng hoặc tên khách..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
            </div>
            <div className="text-sm text-gray-500">Tổng: <b>{orders.length}</b> đơn hàng</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Số lượng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-primary">#{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.items} sản phẩm</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                  </td>
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
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-primary transition-colors">
                        <Eye className="w-5 h-5" />
                    </button>
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

export default AdminOrdersPage;
