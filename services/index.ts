import { publicApi, authApi, adminApi, apiClient } from './api';
import { Product, Category, BlogPost, Collection, Order, DashboardStats } from '../types';

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
  getProducts: async (params?: { per_page?: number; category?: string; sort?: string; q?: string; featured?: boolean }): Promise<Product[]> => {
    const result = await publicApi.getProducts(params as any);
    const mapped = result.data.map(transformProduct);

    // If caller requested only featured products but backend ignored it,
    // apply a defensive client-side filter supporting multiple truthy values.
    if (params?.featured) {
      const isFeatured = (p: any) => {
        if (!p) return false;
        const v = p.featured ?? p.is_featured ?? p.featured_flag;
        return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
      };
      const filtered = mapped.filter(p => isFeatured(p));
      return params?.per_page ? filtered.slice(0, params.per_page) : filtered;
    }

    return params?.per_page ? mapped.slice(0, params.per_page) : mapped;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    try {
      const product = await publicApi.getProductById(id);
      return transformProduct(product);
    } catch {
      return undefined;
    }
  },

  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    const result = await publicApi.getProductsByCategory(categorySlug);
    return result.data.map(transformProduct);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const result = await publicApi.searchProducts(query);
    return result.data.map(transformProduct);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return publicApi.getCategories();
  },

  getCategoriesWithDetails: async (): Promise<Category[]> => {
    return api.getCategories();
  },

  // Settings
  getSettings: async (): Promise<Record<string, string>> => {
    return publicApi.getSettings();
  },

  getRelatedProducts: async (category: string, currentId: number): Promise<Product[]> => {
    const result = await publicApi.getProducts({ category } as any);
    return result.data.filter((p: any) => p.id !== currentId).slice(0, 4).map(transformProduct);
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
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
  },

  getBlogPostById: async (id: number): Promise<BlogPost | undefined> => {
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
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    return adminApi.createBlogPost(post as any);
  },

  updateBlogPost: async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
    return adminApi.updateBlogPost(id, data as any);
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    return adminApi.deleteBlogPost(id);
  },

  // Featured categories
  getFeaturedCategories: async (): Promise<Category[]> => {
    return publicApi.getFeaturedCategories();
  },

  // Collections
  getCollections: async (): Promise<Collection[]> => {
    return publicApi.getCollections();
  },

  // Banners
  getBanners: async (position?: string) => {
    return publicApi.getBanners(position);
  },

  getHeroSlider: async () => {
    return publicApi.getHeroSlider();
  },

  getPromoBanners: async () => {
    return publicApi.getPromoBanners();
  },

  getPopupBanner: async () => {
    return publicApi.getPopupBanner();
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const result = await adminApi.getOrders();
    return result.data;
  },

  createOrder: async (orderData: any): Promise<{ order_id: number; order_number: string; total: number }> => {
    return publicApi.createOrder(orderData);
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    return adminApi.getDashboardStats();
  },

  // Product CRUD
  deleteProduct: async (id: number): Promise<boolean> => {
    return adminApi.deleteProduct(id);
  },

  // Cart validation
  validateCart: publicApi.validateCart,
  checkStock: publicApi.checkStock,
};

// Export individual API modules for direct access
export { publicApi, authApi, adminApi, apiClient };

// Legacy export
export { apiClient as realApi };
