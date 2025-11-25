
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
