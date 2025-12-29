
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { api } from '../services';
import BlogCard from '../components/BlogCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Loader2 } from 'lucide-react';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Tin tức' }]} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Tin Tức</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Cập nhật những xu hướng mới nhất, bí quyết mua sắm và câu chuyện thú vị từ ArmyShop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
