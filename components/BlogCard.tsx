
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getImageUrl(post.image) || '/placeholder-blog.jpg'} 
          alt={post.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase shadow-sm">
          {post.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {post.date}
          </div>
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {post.author}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        
        <Link 
          to={`/blog/${post.id}`}
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-emerald-700 transition-colors mt-auto"
        >
          Đọc tiếp <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
