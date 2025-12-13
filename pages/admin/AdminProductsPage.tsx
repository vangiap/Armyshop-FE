
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle, RefreshCw, Check, X } from 'lucide-react';

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadProducts = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.q = searchQuery;
      
      const result = await adminApi.getProducts(params);
      setProducts(result.data);
      setError(null);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('Unauthenticated')) {
        navigate('/admin/login');
        return;
      }
      setError(err.message || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(search);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      setDeleting(id);
      await adminApi.deleteProduct(id);
      loadProducts(); // Reload
    } catch (err: any) {
      alert(err.message || 'Không thể xóa sản phẩm');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = search ? products : products;

  if (loading && products.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
        <div>
          <h3 className="font-medium text-red-800">Lỗi</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-emerald-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    value={search}
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>
            <button 
              onClick={() => loadProducts(search)} 
              className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="text-sm text-gray-500 ml-auto">Tổng: <b>{products.length}</b> sản phẩm</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên sản phẩm</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Trạng thái</th>
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
                  <td className="px-6 py-4">
                    {product.is_active !== undefined && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.is_active ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                            {deleting === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
