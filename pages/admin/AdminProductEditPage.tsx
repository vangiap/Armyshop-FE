import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services';
import { Product } from '../../types';
import { Loader2, Save, X } from 'lucide-react';

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = id === 'create' || !id;

  const [product, setProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    description: '',
    full_description: '',
    category: '',
    brand: '',
    image: '',
    images: [],
    in_stock: true,
    stock_quantity: 0,
    sku: '',
    is_active: true,
    is_visible: true,
    rating: {
      rate: 0,
      count: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!isCreate && id) {
        setLoading(true);
        try {
          const data = await adminApi.getProduct(parseInt(id));
          setProduct(data);
        } catch (err: any) {
          console.error(err);
          alert('Không thể tải sản phẩm');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      }
      
      // Load categories for dropdown
      try {
        const categoriesData = await adminApi.getCategories();
        setCategories(categoriesData.map(cat => cat.name));
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    load();
  }, [id]);

  const handleChange = (key: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isCreate) {
        await adminApi.createProduct(product as Partial<Product>);
      } else {
        await adminApi.updateProduct(parseInt(id as string), product as Partial<Product>);
      }
      navigate('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isCreate) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isCreate ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h1>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5 mr-1" />
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Thông tin cơ bản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                value={product.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={product.sku || ''}
                onChange={(e) => handleChange('sku', e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá *</label>
              <input
                type="number"
                value={product.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                required
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
              <select
                value={product.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
              <input
                type="text"
                value={product.brand || ''}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                <input
                  type="number"
                  value={product.stock_quantity || ''}
                  onChange={(e) => handleChange('stock_quantity', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  min="0"
                />
              </div>
              
              <div className="flex items-center space-x-4 mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.in_stock !== false}
                    onChange={(e) => handleChange('in_stock', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Còn hàng</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Mô tả</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              value={product.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              value={product.full_description || ''}
              onChange={(e) => handleChange('full_description', e.target.value)}
              rows={6}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Hình ảnh</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chính *</label>
            <input
              type="text"
              value={product.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="URL hình ảnh chính"
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            />
            {product.image && (
              <img
                src={product.image}
                alt="Preview"
                className="mt-2 h-20 w-20 object-cover rounded border border-gray-200"
              />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bổ sung (mỗi URL trên một dòng)</label>
            <textarea
              value={product.images?.join('\n') || ''}
              onChange={(e) => handleChange('images', e.target.value.split('\n').filter(url => url.trim()))}
              rows={4}
              placeholder="Nhập các URL hình ảnh bổ sung, mỗi URL trên một dòng"
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Cài đặt</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={product.is_active !== false}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Kích hoạt</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={product.is_visible !== false}
                onChange={(e) => handleChange('is_visible', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Hiển thị trên cửa hàng</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isCreate ? 'Thêm sản phẩm' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditPage;
