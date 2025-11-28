
import React, { useEffect, useState } from 'react';
import { api } from '../../services/fakeApi';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await api.deleteProduct(id);
      loadProducts(); // Reload
    }
  };

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-emerald-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên sản phẩm</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={product.image} alt="" className="w-12 h-12 rounded object-cover border border-gray-200" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{product.title}</td>
                  <td className="px-6 py-4 font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 capitalize">{product.category.replace(/-/g, ' ')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
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

export default AdminProductsPage;
