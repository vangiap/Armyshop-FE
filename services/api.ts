import { Product, Order, DashboardStats, Category, PaginatedResponse, BlogPost } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  const t = token ?? localStorage.getItem('admin_token');
  if (t) headers['Authorization'] = `Bearer ${t}`;
  return headers;
};

// Helper to handle API responses
const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  const json = await res.json();
  return json.data ?? json;
};

// ============================================================================
// PUBLIC API (No authentication required)
// ============================================================================

export const publicApi = {
  // Products
  getProducts: async (params?: {
    category?: string;
    sort?: string;
    q?: string;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Product[]; meta: PaginatedResponse }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.q) searchParams.append('q', params.q);
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const url = `${API_URL}/api/products${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta ?? {} };
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getProductsByCategory: async (slug: string): Promise<{ data: Product[]; category: Category }> => {
    const res = await fetch(`${API_URL}/api/products/category/${slug}`, { headers: getHeaders() });
    const json = await res.json();
    return { data: json.data ?? [], category: json.category };
  },

  searchProducts: async (query: string): Promise<{ data: Product[]; query: string }> => {
    const res = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`, { 
      headers: getHeaders() 
    });
    const json = await res.json();
    return { data: json.data ?? [], query };
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/api/categories`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/api/categories/featured`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Collections
  getCollections: async (): Promise<{ id: number; title: string; subtitle: string; image: string; images?: { id: number; url: string; alt?: string }[]; link: string }[]> => {
    const res = await fetch(`${API_URL}/api/collections`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Banners
  getBanners: async (position?: string): Promise<{
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    image_mobile?: string;
    link?: string;
    link_text?: string;
    position: string;
    text_color: string;
    overlay_color?: string;
    overlay_opacity: number;
  }[]> => {
    const url = position 
      ? `${API_URL}/api/banners?position=${position}`
      : `${API_URL}/api/banners`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  getHeroSlider: async (): Promise<{
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    image_mobile?: string;
    link?: string;
    link_text?: string;
    text_color: string;
    overlay_color?: string;
    overlay_opacity: number;
  }[]> => {
    const res = await fetch(`${API_URL}/api/banners?position=hero-slider`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getPromoBanners: async (): Promise<{
    id: number;
    title: string;
    subtitle?: string;
    image: string;
    image_mobile?: string;
    link?: string;
    link_text?: string;
    text_color: string;
    overlay_color?: string;
    overlay_opacity: number;
  }[]> => {
    const res = await fetch(`${API_URL}/api/banners/promo`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getPopupBanner: async (): Promise<{
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    link?: string;
    link_text?: string;
  } | null> => {
    const res = await fetch(`${API_URL}/api/banners/popup`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Settings
  getSettings: async (): Promise<Record<string, string>> => {
    const res = await fetch(`${API_URL}/api/settings`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Cart
  validateCart: async (items: { variant_id: number; quantity: number }[]): Promise<{
    items: any[];
    removed_items: any[];
    updated_items: any[];
    subtotal: number;
  }> => {
    const res = await fetch(`${API_URL}/api/cart/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items })
    });
    return handleResponse(res);
  },

  checkStock: async (variant_id: number, quantity: number): Promise<{
    available: boolean;
    available_stock: number;
  }> => {
    const res = await fetch(`${API_URL}/api/cart/check-stock`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ variant_id, quantity })
    });
    return handleResponse(res);
  },

  // Orders (public checkout)
  createOrder: async (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: {
      street: string;
      city: string;
      district?: string;
      ward?: string;
    };
    items: { variant_id: number; quantity: number }[];
    note?: string;
    payment_method?: 'cod' | 'bank_transfer';
  }): Promise<{ order_id: number; order_number: string; total: number }> => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/orders/${orderNumber}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Blogs - Public access
  getBlogPosts: async (): Promise<{ data: BlogPost[]; meta: PaginatedResponse }> => {
    const res = await fetch(`${API_URL}/api/blogs`, { headers: getHeaders() });
    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta ?? {} };
  },

  getBlogPost: async (id: number): Promise<BlogPost> => {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
};

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  login: async (credentials: { email?: string; username?: string; password: string }): Promise<{
    user: { id: number; name: string; email: string; role: string };
    token: string;
  }> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse<any>(res);
    
    // Store token
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  getMe: async (): Promise<{ id: number; name: string; email: string; role: string }> => {
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: getHeaders() });
    return handleResponse(res);
  },
};

// ============================================================================
// ADMIN API (Requires authentication)
// ============================================================================

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_URL}/api/admin/dashboard`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Products
  getProducts: async (params?: { status?: string; category_id?: number; q?: string }): Promise<{ data: Product[]; meta: PaginatedResponse }> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params?.q) searchParams.append('q', params.q);
    
    const url = `${API_URL}/api/admin/products${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta ?? {} };
  },

  getProduct: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  // Orders
  getOrders: async (params?: { status?: string; from?: string; to?: string; q?: string }): Promise<{ data: Order[]; meta: PaginatedResponse }> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.from) searchParams.append('from', params.from);
    if (params?.to) searchParams.append('to', params.to);
    if (params?.q) searchParams.append('q', params.q);
    
    const url = `${API_URL}/api/admin/orders${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return { data: json.data ?? [], meta: json.meta ?? {} };
  },

  getOrder: async (id: number): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/admin/orders/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  updateOrderStatus: async (id: number, status: string, note?: string): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
    return handleResponse(res);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/api/admin/categories`, { headers: getHeaders() });
    return handleResponse(res);
  },

  deleteCategory: async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
  },

  // Blogs (Admin)
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const res = await fetch(`${API_URL}/api/admin/blogs`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getBlogPost: async (id: number): Promise<BlogPost> => {
    const res = await fetch(`${API_URL}/api/admin/blogs/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  createBlogPost: async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await fetch(`${API_URL}/api/admin/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  updateBlogPost: async (id: number, postData: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete blog post');
    return true;
  },
};

// ============================================================================
// LEGACY API CLIENT (For backward compatibility)
// ============================================================================

export const apiClient = {
  getProducts: async (_token?: string): Promise<Product[]> => {
    const result = await adminApi.getProducts();
    return result.data;
  },

  loginAdmin: async (username: string, password: string) => {
    return authApi.login({ username, password });
  },

  getOrders: async (_token?: string): Promise<Order[]> => {
    const result = await adminApi.getOrders();
    return result.data;
  },

  getDashboardStats: async (_token?: string): Promise<DashboardStats> => {
    return adminApi.getDashboardStats();
  },

  deleteProduct: async (id: number, _token?: string) => {
    return adminApi.deleteProduct(id);
  }
};

// Default export for convenience
export default {
  public: publicApi,
  auth: authApi,
  admin: adminApi,
  client: apiClient,
};
