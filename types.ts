export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  avatar?: string;
  bio?: string;
}

export enum Category {
  All = 'All',
  Electronics = 'Electronics',
  Fashion = 'Fashion',
  Home = 'Home',
  Lifestyle = 'Lifestyle'
}

export interface AIReply {
  message: string;
  recommendedProductIds: number[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  recommendations?: Product[];
}
