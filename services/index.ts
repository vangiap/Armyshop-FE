import { api as fakeApi } from './fakeApi';
import { publicApi, authApi, adminApi, apiClient } from './api';
import { Product, Category, BlogPost, Collection, Order, DashboardStats } from '../types';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to fix image URLs from API
const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder-product.jpg';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/storage')) return `${API_BASE_URL}${url}`;
  return url;
};

// Transform product to fix image URLs and ensure correct types
const transformProduct = (product: Product): Product => {
  // Normalize category: API may return a slug string or a category object
  let categorySlug: string = '';
  let categoryName: string | undefined = product.category_name;

  if (product.category && typeof product.category === 'string') {
    categorySlug = product.category;
  } else if (product.category && typeof product.category === 'object') {
    const cat: any = product.category as any;
    categorySlug = (cat.slug && String(cat.slug)) || (cat.id && String(cat.id)) || (cat.name && String(cat.name).replace(/\s+/g, '-').toLowerCase()) || '';
    categoryName = categoryName || cat.name || categorySlug;
  }

  // Fallback when nothing provided
  if (!categorySlug && product.category_name) {
    categorySlug = String(product.category_name).replace(/\s+/g, '-').toLowerCase();
  }

  return {
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    category: categorySlug || (product.category as unknown as string) || '',
    category_name: categoryName || (product.category as unknown as string) || product.category_name,
    image: fixImageUrl(product.image),
    images: product.images?.map(fixImageUrl) || [fixImageUrl(product.image)]
  } as Product;
};

// Unified API interface that works with both fake and real API
export const api = {
  // Products
  getProducts: async (params?: { per_page?: number; category?: string; sort?: string; q?: string }): Promise<Product[]> => {
    if (USE_REAL_API) {
      const result = await publicApi.getProducts(params as any);
      return result.data.map(transformProduct);
    }
    const products = await fakeApi.getProducts();
    if (params?.per_page) return products.slice(0, params.per_page);
    return products;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    if (USE_REAL_API) {
      try {
        const product = await publicApi.getProductById(id);
        return transformProduct(product);
      } catch {
        return undefined;
      }
    }
    return fakeApi.getProductById(id);
  },

  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    if (USE_REAL_API) {
      const result = await publicApi.getProductsByCategory(categorySlug);
      return result.data.map(transformProduct);
    }
    const products = await fakeApi.getProducts();
    return products.filter(p => p.category === categorySlug);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    if (USE_REAL_API) {
      const result = await publicApi.searchProducts(query);
      return result.data.map(transformProduct);
    }
    const products = await fakeApi.getProducts();
    return products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    if (USE_REAL_API) {
      return publicApi.getCategories();
    }
    const cats = await fakeApi.getCategories();
    return cats.map((slug, idx) => ({
      id: idx + 1,
      name: slug.replace(/-/g, ' '),
      slug,
      products_count: 0
    }));
  },

  getCategoriesWithDetails: async (): Promise<Category[]> => {
    return api.getCategories();
  },

  // Settings
  getSettings: async (): Promise<Record<string, string>> => {
    if (USE_REAL_API) {
      return publicApi.getSettings();
    }
    // Default settings for fake API
    return {
      site_name: 'Army Shop',
      site_description: 'Cửa hàng quân đội - Phụ kiện quân nhân',
      contact_email: 'contact@armyshop.vn',
      contact_phone: '0123 456 789',
      contact_hotline: '1900 1234',
      contact_address: 'Hà Nội, Việt Nam',
      contact_working_hours: '8:00 - 22:00 (T2 - CN)',
      social_facebook: '',
      social_zalo: '',
      social_tiktok: '',
    };
  },

  getRelatedProducts: async (category: string, currentId: number): Promise<Product[]> => {
    if (USE_REAL_API) {
      const result = await publicApi.getProducts({ category });
      return result.data.filter(p => p.id !== currentId).slice(0, 4).map(transformProduct);
    }
    return fakeApi.getRelatedProducts(category, currentId);
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
    if (USE_REAL_API) {
      const result = await publicApi.getBlogPosts();
      return result.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: fixImageUrl(post.image),
        author: post.author,
        date: post.date,
        category: post.category,
      }));
    }
    return fakeApi.getBlogPosts();
  },

  getBlogPostById: async (id: number): Promise<BlogPost | undefined> => {
    if (USE_REAL_API) {
      const result = await publicApi.getBlogPost(id);
      if (result) {
        return {
          id: result.id,
          title: result.title,
          excerpt: result.excerpt,
          content: result.content,
          image: fixImageUrl(result.image),
          author: result.author,
          date: result.date,
          category: result.category,
        };
      }
      return undefined;
    }
    return fakeApi.getBlogPostById(id);
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    if (USE_REAL_API) {
      return adminApi.createBlogPost(post as any);
    }
    return fakeApi.createBlogPost(post);
  },

  updateBlogPost: async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
    if (USE_REAL_API) {
      return adminApi.updateBlogPost(id, data as any);
    }
    return fakeApi.updateBlogPost(id, data);
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    if (USE_REAL_API) {
      return adminApi.deleteBlogPost(id);
    }
    return fakeApi.deleteBlogPost(id);
  },

  // Featured categories
  getFeaturedCategories: async (): Promise<Category[]> => {
    if (USE_REAL_API) {
      return publicApi.getFeaturedCategories();
    }
    // Fallback: return categories with most products
    const categorySlugs = await fakeApi.getCategories();
    const mockCategories: Category[] = categorySlugs.slice(0, 4).map((slug, index) => ({
      id: index + 1,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      slug: slug,
      description: `Danh mục ${slug}`,
      image: `https://picsum.photos/id/${100 + index}/400/400`,
      products_count: Math.floor(Math.random() * 50) + 10,
      is_active: true
    }));
    return mockCategories;
  },

  // Collections
  getCollections: async (): Promise<Collection[]> => {
    if (USE_REAL_API) {
      return publicApi.getCollections();
    }
    return fakeApi.getCollections();
  },

  // Banners
  getBanners: async (position?: string) => {
    if (USE_REAL_API) {
      return publicApi.getBanners(position);
    }
    // Fake banners for development
    return [];
  },

  getHeroSlider: async () => {
    if (USE_REAL_API) {
      return publicApi.getHeroSlider();
    }
    // Fake hero slides
    return [
      {
        id: 1,
        title: 'Chào mừng đến Army Shop',
        subtitle: 'Phụ kiện quân đội chính hãng',
        image: '/images/hero-1.jpg',
        link: '/products',
        link_text: 'Mua ngay',
        text_color: '#ffffff',
        overlay_opacity: 40,
      }
    ];
  },

  getPromoBanners: async () => {
    if (USE_REAL_API) {
      return publicApi.getPromoBanners();
    }
    return [];
  },

  getPopupBanner: async () => {
    if (USE_REAL_API) {
      return publicApi.getPopupBanner();
    }
    return null;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    if (USE_REAL_API) {
      const result = await adminApi.getOrders();
      return result.data;
    }
    return fakeApi.getOrders();
  },

  createOrder: async (orderData: any): Promise<{ order_id: number; order_number: string; total: number }> => {
    if (USE_REAL_API) {
      return publicApi.createOrder(orderData);
    }
    // Fake implementation
    return {
      order_id: Math.floor(Math.random() * 10000),
      order_number: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      total: orderData.items?.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0) || 0
    };
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    if (USE_REAL_API) {
      return adminApi.getDashboardStats();
    }
    return fakeApi.getDashboardStats();
  },

  // Product CRUD
  deleteProduct: async (id: number): Promise<boolean> => {
    if (USE_REAL_API) {
      return adminApi.deleteProduct(id);
    }
    return fakeApi.deleteProduct(id);
  },

  // Cart validation
  validateCart: USE_REAL_API ? publicApi.validateCart : async () => ({ items: [], removed_items: [], updated_items: [], subtotal: 0 }),
  checkStock: USE_REAL_API ? publicApi.checkStock : async () => ({ available: true, available_stock: 100 }),
};

// Export individual API modules for direct access
export { publicApi, authApi, adminApi, apiClient };

// Legacy export
export { apiClient as realApi };
export { fakeApi };
