import { Product, Category, UserProfile, Order } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Quantum Noise-Canceling Headphones",
    price: 24999,
    category: Category.Electronics,
    description: "Experience silence with our next-gen active noise canceling technology. 30-hour battery life. Features plush ear cushions for long listening sessions and transparent mode to hear your surroundings when needed.",
    image: "https://picsum.photos/id/1/600/600",
    images: [
      "https://picsum.photos/id/1/600/600",
      "https://picsum.photos/id/250/600/600",
      "https://picsum.photos/id/6/600/600"
    ],
    rating: 4.8,
    reviews: 124,
    stock: 45,
    discount: 10
  },
  {
    id: 2,
    name: "Minimalist Leather Backpack",
    price: 12499,
    category: Category.Fashion,
    description: "Handcrafted from genuine full-grain leather. Fits up to 15-inch laptops with ease. Includes multiple internal pockets for organization and a weather-resistant finish.",
    image: "https://picsum.photos/id/2/600/600",
    images: [
      "https://picsum.photos/id/2/600/600",
      "https://picsum.photos/id/103/600/600",
      "https://picsum.photos/id/22/600/600"
    ],
    rating: 4.6,
    reviews: 89,
    stock: 20,
    discount: 0
  },
  {
    id: 3,
    name: "Smart Home Hub Display",
    price: 9999,
    category: Category.Electronics,
    description: "Control your entire home with voice commands. Features a crisp 10-inch HD touchscreen. Compatible with all major smart home protocols including Zigbee and Z-Wave.",
    image: "https://picsum.photos/id/3/600/600",
    images: [
      "https://picsum.photos/id/3/600/600",
      "https://picsum.photos/id/201/600/600",
      "https://picsum.photos/id/119/600/600"
    ],
    rating: 4.5,
    reviews: 210,
    stock: 0, // Sold out
    discount: 0
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 2499,
    category: Category.Fashion,
    description: "Sustainably sourced 100% organic cotton. Ultra-soft feel and durable stitching. Pre-shrunk to ensure a perfect fit wash after wash.",
    image: "https://picsum.photos/id/4/600/600",
    images: [
      "https://picsum.photos/id/4/600/600",
      "https://picsum.photos/id/177/600/600"
    ],
    rating: 4.2,
    reviews: 45,
    stock: 100,
    discount: 25
  },
  {
    id: 5,
    name: "Ergonomic Office Chair",
    price: 34999,
    category: Category.Home,
    description: "Designed for all-day comfort. Adjustable lumbar support and breathable mesh back. Features 4D armrests and a premium synchronous tilt mechanism.",
    image: "https://picsum.photos/id/5/600/600",
    images: [
      "https://picsum.photos/id/5/600/600",
      "https://picsum.photos/id/366/600/600",
      "https://picsum.photos/id/180/600/600"
    ],
    rating: 4.9,
    reviews: 315,
    stock: 15,
    discount: 5
  },
  {
    id: 6,
    name: "Ceramic Pour-Over Coffee Set",
    price: 3999,
    category: Category.Lifestyle,
    description: "Brew the perfect cup. Includes ceramic dripper, glass carafe, and reusable filter. The minimalist design looks great on any kitchen counter.",
    image: "https://picsum.photos/id/6/600/600",
    images: [
      "https://picsum.photos/id/6/600/600",
      "https://picsum.photos/id/431/600/600"
    ],
    rating: 4.7,
    reviews: 67,
    stock: 30,
    discount: 0
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    price: 1999,
    category: Category.Electronics,
    description: "Fast charging for all Qi-enabled devices. Sleek, low-profile design with non-slip surface.",
    image: "https://picsum.photos/id/7/600/600",
    images: [
      "https://picsum.photos/id/7/600/600",
      "https://picsum.photos/id/8/600/600"
    ],
    rating: 4.3,
    reviews: 150,
    stock: 80,
    discount: 0
  },
  {
    id: 8,
    name: "Vintage Denim Jacket",
    price: 6999,
    category: Category.Fashion,
    description: "Classic styling with modern fit. Durable denim that gets better with age. Features copper hardware and contrast stitching.",
    image: "https://picsum.photos/id/8/600/600",
    images: [
      "https://picsum.photos/id/8/600/600",
      "https://picsum.photos/id/129/600/600"
    ],
    rating: 4.4,
    reviews: 92,
    stock: 8,
    discount: 15
  },
  {
    id: 9,
    name: "Smart Plant Sensor",
    price: 1499,
    category: Category.Home,
    description: "Tracks moisture, light, and temperature to keep your plants happy and healthy. Connects via Bluetooth to your smartphone.",
    image: "https://picsum.photos/id/9/600/600",
    images: [
      "https://picsum.photos/id/9/600/600",
      "https://picsum.photos/id/10/600/600"
    ],
    rating: 4.1,
    reviews: 34,
    stock: 50,
    discount: 0
  },
  {
    id: 10,
    name: "Yoga Mat Pro",
    price: 4499,
    category: Category.Lifestyle,
    description: "Extra thick non-slip surface for stability during intense sessions. Made from eco-friendly materials and easy to clean.",
    image: "https://picsum.photos/id/10/600/600",
    images: [
      "https://picsum.photos/id/10/600/600",
      "https://picsum.photos/id/11/600/600"
    ],
    rating: 4.8,
    reviews: 200,
    stock: 12,
    discount: 0
  },
  {
    id: 11,
    name: "4K Action Camera",
    price: 19999,
    category: Category.Electronics,
    description: "Capture life's adventures in stunning 4K. Waterproof up to 10 meters without a case. Includes mounting accessories.",
    image: "https://picsum.photos/id/11/600/600",
    images: [
      "https://picsum.photos/id/11/600/600",
      "https://picsum.photos/id/12/600/600"
    ],
    rating: 4.5,
    reviews: 112,
    stock: 25,
    discount: 5
  },
  {
    id: 12,
    name: "Bamboo Cutting Board",
    price: 1299,
    category: Category.Home,
    description: "Eco-friendly, durable, and knife-friendly. Features juice grooves to keep counters clean. Antimicrobial properties.",
    image: "https://picsum.photos/id/12/600/600",
    images: [
      "https://picsum.photos/id/12/600/600",
      "https://picsum.photos/id/13/600/600"
    ],
    rating: 4.6,
    reviews: 78,
    stock: 60,
    discount: 0
  }
];

export const MOCK_ORDERS: Order[] = [];