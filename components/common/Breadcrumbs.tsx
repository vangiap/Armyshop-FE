import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
      </li>
      {items.map((item, index) => (
        <li key={index}>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {item.path ? (
              <Link to={item.path} className="ml-1 md:ml-2 hover:text-primary transition-colors capitalize">
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 md:ml-2 text-gray-700 font-medium capitalize truncate max-w-[200px]">{item.label}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;