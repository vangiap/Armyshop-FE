import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services';
import { BlogPost } from '../../types';
import { Loader2 } from 'lucide-react';

const AdminBlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = id === 'create' || !id;

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: '',
    date: new Date().toLocaleDateString('vi-VN')
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isCreate && id) {
        setLoading(true);
        try {
          const data = await adminApi.getBlogPost(parseInt(id));
          setPost(data);
        } catch (err: any) {
          console.error(err);
          alert('Không thể tải bài viết');
          navigate('/admin/blogs');
        } finally {
          setLoading(false);
        }
      }
    };
    load();
  }, [id]);

  const handleChange = (key: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isCreate) {
        await adminApi.createBlogPost(post as Partial<BlogPost>);
      } else {
        await adminApi.updateBlogPost(parseInt(id as string), post as Partial<BlogPost>);
      }
      navigate('/admin/blogs');
    } catch (err: any) {
      alert(err.message || 'Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isCreate ? 'Tạo bài viết' : 'Chỉnh sửa bài viết'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input value={post.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
          <input value={post.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung (HTML)</label>
          <textarea value={post.content || ''} onChange={(e) => handleChange('content', e.target.value)} rows={10} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh (URL)</label>
            <input value={post.image || ''} onChange={(e) => handleChange('image', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tác giả</label>
            <input value={post.author || ''} onChange={(e) => handleChange('author', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <input value={post.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded p-2" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button disabled={loading} type="submit" className="bg-primary text-white px-4 py-2 rounded">
            Lưu
          </button>
          <button type="button" onClick={() => navigate('/admin/blogs')} className="px-4 py-2 border rounded">Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditPage;
