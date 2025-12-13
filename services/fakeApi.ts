
import { Product, BlogPost, Collection, Order, DashboardStats } from '../types';

// Mock Data Products
let PRODUCTS: Product[] = [
  // --- Thời trang nam ---
  {
    id: 1,
    title: "Balo Thời Trang Nam Cao Cấp",
    price: 450000,
    description: "Balo vừa vặn cho laptop 15.6 inch, chống nước nhẹ, thiết kế hiện đại phù hợp đi làm và đi học.",
    category: "thoi-trang-nam",
    image: "https://picsum.photos/id/103/400/400",
    images: [
      "https://picsum.photos/id/103/400/400",
      "https://picsum.photos/id/104/400/400", 
      "https://picsum.photos/id/101/400/400"
    ],
    rating: { rate: 4.5, count: 120 },
    reviews: [
      { id: 1, user: "Nguyễn Văn A", comment: "Balo đẹp, chắc chắn.", rating: 5, date: "2023-10-12" },
      { id: 2, user: "Trần Thị B", comment: "Giao hàng hơi chậm nhưng hàng tốt.", rating: 4, date: "2023-10-15" }
    ],
    colors: ["Đen", "Xám", "Xanh Navy"],
    sizes: ["Tiêu chuẩn"]
  },
  {
    id: 2,
    title: "Áo Thun Cotton Basic",
    price: 150000,
    description: "Chất liệu 100% cotton thoáng mát, thấm hút mồ hôi tốt. Kiểu dáng slimfit tôn dáng.",
    category: "thoi-trang-nam",
    image: "https://picsum.photos/id/1059/400/400",
    rating: { rate: 4.1, count: 259 },
    colors: ["Trắng", "Đen", "Xám"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    title: "Áo Khoác Gió Nam",
    price: 550000,
    description: "Áo khoác gió 2 lớp, chống nước, giữ ấm tốt trong mùa đông.",
    category: "thoi-trang-nam",
    image: "https://picsum.photos/id/1005/400/400",
    rating: { rate: 4.7, count: 500 },
    colors: ["Đỏ đô", "Xanh than", "Đen"],
    sizes: ["M", "L", "XL", "2XL"]
  },
  {
    id: 101,
    title: "Quần Jean Nam Slimfit",
    price: 480000,
    description: "Quần Jean co giãn, màu sắc trẻ trung, dễ phối đồ.",
    category: "thoi-trang-nam",
    image: "https://images.unsplash.com/photo-1542272617-08f086303294?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.3, count: 150 },
    colors: ["Xanh nhạt", "Xanh đậm"],
    sizes: ["29", "30", "31", "32"]
  },

  // --- Thời trang nữ ---
  {
    id: 8,
    title: "Áo Khoác Dạ Nữ",
    price: 1200000,
    description: "Phong cách Hàn Quốc, giữ ấm cực tốt, màu sắc trang nhã.",
    category: "thoi-trang-nu",
    image: "https://picsum.photos/id/325/400/400",
    rating: { rate: 4.5, count: 100 },
    colors: ["Be", "Nâu đất", "Đen"],
    sizes: ["S", "M", "L"]
  },
  {
    id: 201,
    title: "Đầm Hoa Nhí Vintage",
    price: 350000,
    description: "Đầm voan hoa nhí nhẹ nhàng, phù hợp đi chơi, dạo phố.",
    category: "thoi-trang-nu",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.6, count: 88 },
    sizes: ["S", "M"]
  },
  {
    id: 202,
    title: "Chân Váy Xếp Ly",
    price: 250000,
    description: "Chân váy dài xếp ly, lưng thun thoải mái.",
    category: "thoi-trang-nu",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.2, count: 45 },
    colors: ["Đen", "Nâu", "Kem"],
    sizes: ["Freesize"]
  },
  {
    id: 203,
    title: "Áo Sơ Mi Lụa",
    price: 420000,
    description: "Chất liệu lụa mềm mại, sang trọng, không nhăn.",
    category: "thoi-trang-nu",
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.8, count: 210 },
    colors: ["Trắng", "Xanh pastel"],
    sizes: ["S", "M", "L"]
  },

  // --- Trang sức ---
  {
    id: 4,
    title: "Vòng Tay Bạc Nữ",
    price: 890000,
    description: "Trang sức bạc cao cấp, thiết kế tinh xảo, đính đá sang trọng.",
    category: "trang-suc",
    image: "https://picsum.photos/id/106/400/400",
    rating: { rate: 4.6, count: 400 },
    colors: ["Bạc", "Vàng hồng"]
  },
  {
    id: 5,
    title: "Nhẫn Đính Đá Quý",
    price: 6500000,
    description: "Nhẫn vàng trắng đính đá quý tự nhiên, quà tặng hoàn hảo cho người thương.",
    category: "trang-suc",
    image: "https://picsum.photos/id/1070/400/400",
    rating: { rate: 3.9, count: 70 },
    sizes: ["6", "7", "8", "9"]
  },
  {
    id: 301,
    title: "Dây Chuyền Mặt Trăng",
    price: 550000,
    description: "Dây chuyền bạc 925, mặt hình trăng khuyết đính đá.",
    category: "trang-suc",
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.7, count: 120 }
  },
  {
    id: 302,
    title: "Bông Tai Ngọc Trai",
    price: 1200000,
    description: "Ngọc trai nuôi nước ngọt, chốt bạc ý.",
    category: "trang-suc",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.5, count: 90 }
  },

  // --- Điện tử ---
  {
    id: 6,
    title: "Ổ Cứng SSD 1TB",
    price: 2100000,
    description: "Tốc độ đọc ghi cực nhanh, bảo hành 3 năm. Nâng cấp hiệu suất máy tính của bạn.",
    category: "dien-tu",
    image: "https://picsum.photos/id/0/400/400",
    rating: { rate: 4.8, count: 319 }
  },
  {
    id: 7,
    title: "Màn Hình Máy Tính 24 Inch",
    price: 3500000,
    description: "Màn hình IPS Full HD, tần số quét 75Hz, bảo vệ mắt.",
    category: "dien-tu",
    image: "https://picsum.photos/id/119/400/400",
    rating: { rate: 4.2, count: 150 }
  },
  {
    id: 401,
    title: "Tai Nghe Bluetooth Chụp Tai",
    price: 1800000,
    description: "Chống ồn chủ động, pin trâu 30h nghe nhạc liên tục.",
    category: "dien-tu",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.6, count: 500 },
    colors: ["Đen", "Bạc"]
  },
  {
    id: 402,
    title: "Loa Bluetooth Mini",
    price: 650000,
    description: "Nhỏ gọn, âm bass mạnh mẽ, chống nước IPX7.",
    category: "dien-tu",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",
    rating: { rate: 4.4, count: 300 },
    colors: ["Đỏ", "Xanh", "Đen"]
  }
];

// Mock Data Blogs
let BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Xu hướng thời trang Thu Đông 2024",
    excerpt: "Khám phá những phong cách thời trang sẽ lên ngôi trong mùa thu đông năm nay với các gam màu ấm áp.",
    content: "<p>Năm 2024 đánh dấu sự trở lại của phong cách tối giản (Minimalism) kết hợp với các gam màu trung tính...</p>",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    author: "Minh Anh",
    date: "10/05/2024",
    category: "Thời trang"
  },
  {
    id: 2,
    title: "Cách chọn laptop phù hợp cho sinh viên",
    excerpt: "Hướng dẫn chi tiết cách lựa chọn cấu hình laptop vừa túi tiền nhưng vẫn đáp ứng tốt nhu cầu học tập.",
    content: "<p>Khi lựa chọn laptop cho sinh viên, yếu tố quan trọng nhất là sự cân bằng giữa hiệu năng và tính di động...</p>",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    author: "Tuấn Hưng",
    date: "12/05/2024",
    category: "Công nghệ"
  },
  {
    id: 3,
    title: "5 món phụ kiện không thể thiếu",
    excerpt: "Nâng tầm phong cách cá nhân chỉ với những món phụ kiện nhỏ xinh nhưng vô cùng 'có võ'.",
    content: "<p>Phụ kiện đóng vai trò quan trọng trong việc hoàn thiện outfit của bạn...</p>",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    author: "Lan Ngọc",
    date: "15/05/2024",
    category: "Phong cách sống"
  }
];

// Mock Collections
const COLLECTIONS: Collection[] = [
  {
    id: 1,
    title: "Summer Vibes",
    subtitle: "Bộ sưu tập mùa hè",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    link: "/products?category=thoi-trang-nam"
  },
  {
    id: 2,
    title: "Office Chic",
    subtitle: "Thời trang công sở",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    link: "/products?category=thoi-trang-nu"
  },
  {
    id: 3,
    title: "Tech Lovers",
    subtitle: "Đồ chơi công nghệ",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    link: "/products?category=dien-tu"
  }
];

// Mock Orders
let ORDERS: Order[] = [
    { id: 'ORD-001', customerName: 'Nguyễn Văn A', date: '2023-10-25', total: 450000, status: 'completed', items: 1 },
    { id: 'ORD-002', customerName: 'Trần Thị B', date: '2023-10-26', total: 1200000, status: 'shipping', items: 2 },
    { id: 'ORD-003', customerName: 'Lê Văn C', date: '2023-10-27', total: 3500000, status: 'pending', items: 1 },
    { id: 'ORD-004', customerName: 'Phạm Thị D', date: '2023-10-27', total: 150000, status: 'cancelled', items: 1 },
    { id: 'ORD-005', customerName: 'Hoàng Văn E', date: '2023-10-28', total: 890000, status: 'pending', items: 1 },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getProducts: async (): Promise<Product[]> => {
    await delay(800);
    return PRODUCTS;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    await delay(500);
    return PRODUCTS.find(p => p.id === id);
  },

  getCategories: async (): Promise<string[]> => {
    await delay(300);
    const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));
    return categories;
  },

  getRelatedProducts: async (category: string, currentId: number): Promise<Product[]> => {
    await delay(400);
    return PRODUCTS.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    await delay(600);
    return BLOG_POSTS;
  },

  getBlogPostById: async (id: number): Promise<BlogPost | undefined> => {
    await delay(400);
    return BLOG_POSTS.find(p => p.id === id);
  },

  createBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    await delay(400);
    const maxId = BLOG_POSTS.reduce((m, p) => Math.max(m, p.id), 0);
    const newPost: BlogPost = {
      id: maxId + 1,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || 'https://picsum.photos/800/400',
      author: post.author || 'Admin',
      date: post.date || new Date().toLocaleDateString('vi-VN'),
      category: post.category || 'Khác'
    } as BlogPost;
    BLOG_POSTS.unshift(newPost);
    return newPost;
  },

  updateBlogPost: async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
    await delay(400);
    const idx = BLOG_POSTS.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Bài viết không tồn tại');
    BLOG_POSTS[idx] = { ...BLOG_POSTS[idx], ...data } as BlogPost;
    return BLOG_POSTS[idx];
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    await delay(300);
    const before = BLOG_POSTS.length;
    BLOG_POSTS = BLOG_POSTS.filter(p => p.id !== id);
    return BLOG_POSTS.length < before;
  },

  getCollections: async (): Promise<Collection[]> => {
    await delay(500);
    return COLLECTIONS;
  },

  // Admin APIs
  getOrders: async (): Promise<Order[]> => {
    await delay(600);
    return ORDERS;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    const totalRevenue = ORDERS.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    return {
        totalRevenue,
        totalOrders: ORDERS.length,
        totalProducts: PRODUCTS.length,
        recentOrders: ORDERS.slice(0, 5) // Recent 5
    };
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    await delay(500);
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    return true;
  }
};
