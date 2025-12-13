
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../../types';
import { api } from '../../services';
import BlogCard from '../BlogCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LatestNews: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getBlogPosts();
        setPosts(data.slice(0, 3)); // Only take latest 3
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tin Tức & Sự Kiện</h2>
            <div className="w-20 h-1 bg-primary mt-3 rounded-full"></div>
          </div>
          <Link to="/blog" className="hidden md:flex items-center text-primary font-semibold hover:text-emerald-700 transition-colors">
            Xem tất cả tin tức <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
            <Link to="/blog" className="inline-flex items-center text-primary font-semibold hover:text-emerald-700 transition-colors">
                Xem tất cả tin tức <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
