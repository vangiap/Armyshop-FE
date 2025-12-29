import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services';
import { BlogPost } from '../../types';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const AdminBlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadPosts = async () => {
    try {
      const data = await adminApi.getBlogPosts();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('401')) navigate('/admin/login');
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      setDeleting(id);
      await adminApi.deleteBlogPost(id);
      await loadPosts();
    } catch (err: any) {
      alert(err.message || 'Xảy ra lỗi khi xóa');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Link to="/admin/blogs/create" className="bg-primary text-white px-4 py-2 rounded-lg inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">Tổng: <b>{posts.length}</b> bài viết</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Ảnh</th>
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={getImageUrl(p.image) || '/placeholder-blog.jpg'} alt={p.title} className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">{p.author}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/admin/blogs/${p.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

export default AdminBlogsPage;
