
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { api } from '../services';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Loader2, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getBlogPostById(parseInt(id));
        setPost(data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h2>
      <button onClick={() => navigate('/blog')} className="mt-4 text-primary hover:underline">Quay lại trang tin tức</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Tin tức', path: '/blog' },
        { label: post.title }
      ]} />

      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-64 md:h-96 object-cover"
        />
        
        <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                    {post.category}
                </span>
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                </div>
                <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                </div>
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    5 phút đọc
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
            </h1>

            <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="lead text-xl text-gray-600 mb-6 font-medium italic border-l-4 border-primary pl-4">
                    {post.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-900 font-bold text-lg">Chia sẻ bài viết:</div>
                <div className="flex space-x-3">
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
