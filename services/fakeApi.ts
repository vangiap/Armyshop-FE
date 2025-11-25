
import { Product } from '../types';

// Mock Data
const PRODUCTS: Product[] = [
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
    images: [
      "https://picsum.photos/id/1059/400/400",
      "https://picsum.photos/id/1060/400/400"
    ],
    rating: { rate: 4.1, count: 259 },
    reviews: [
        { id: 1, user: "Le Van C", comment: "Vải mát, mặc thích.", rating: 5, date: "2023-09-20" }
    ],
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
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getProducts: async (): Promise<Product[]> => {
    await delay(800); // 800ms simulation
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
  }
};
