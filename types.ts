
export interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  compare_price?: number;
  image?: string; // Variant-specific image
  attributes: { name: string; value: string }[];
  stock: number;
  in_stock: boolean;
}

export interface Product {
  id: number;
  title: string;
  slug?: string;
  price: number;
  price_max?: number;
  description: string;
  full_description?: string;
  category: string;
  category_name?: string;
  brand?: string;
  image: string;
  images?: string[];
  rating: {
    rate: number;
    count: number;
  };
  reviews?: Review[];
  colors?: string[];
  sizes?: string[];
  attributes?: Record<string, string[]>; // Other attributes like "Binh chủng"
  in_stock?: boolean;
  stock_quantity?: number;
  variants?: ProductVariant[];
  sku?: string;
  is_active?: boolean;
  is_visible?: boolean;
  featured?: boolean; // Flag for featured products
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedAttributes?: Record<string, string>; // Other selected attributes like "Binh chủng"
  variant_id?: number; // For API integration
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products_count?: number;
  is_active?: boolean;
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
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

export interface CollectionImage {
  id: number;
  url: string;
  alt?: string;
}

export interface Collection {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  images?: CollectionImage[];
  link?: string;
}

export interface OrderItem {
  id: number;
  title: string;
  sku?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Order {
  id: string | number;
  order_number?: string;
  customerName?: string; // Legacy
  customer_name?: string; // API format
  customer_email?: string;
  customer_phone?: string;
  date?: string; // Legacy
  created_at?: string; // API format
  updated_at?: string;
  total: number;
  subtotal?: number;
  shipping_fee?: number;
  discount?: number;
  status: 'pending' | 'processing' | 'shipping' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  payment_status?: string;
  payment_method?: string;
  items: OrderItem[] | number;
  shipping_address?: {
    name?: string;
    phone?: string;
    street: string;
    city: string;
    district?: string;
    ward?: string;
  };
  note?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: Order[];
}

export interface PaginatedResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginatedResponse;
}