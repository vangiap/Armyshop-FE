
export interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[]; // Gallery images
  rating: {
    rate: number;
    count: number;
  };
  reviews?: Review[];
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface FilterState {
  category: string;
  sort: 'asc' | 'desc' | 'default';
  search: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  image: string;
  author: string;
  date: string;
  category: string;
}

export interface Collection {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

// New Types for Admin
export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  items: number; // Count of items
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: Order[];
}