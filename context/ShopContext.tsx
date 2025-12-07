import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, UserProfile } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  wishlist: Product[];
  categories: string[];
  userProfile: UserProfile | null;
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  deleteProduct: (id: number) => void;
  updateProductPrice: (id: number, newPrice: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addOrder: (order: Order) => void;
  updateUserProfile: (profile: UserProfile) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Lifestyle'];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize products from local storage or fall back to MOCK_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('nexstore_products');
    return savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('nexstore_categories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nexstore_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Load orders from local storage
  useEffect(() => {
    const savedOrders = localStorage.getItem('nexstore_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
  }, []);

  // Load wishlist from local storage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('nexstore_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  // Load user profile from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('nexstore_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('nexstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders to local storage
  useEffect(() => {
    localStorage.setItem('nexstore_orders', JSON.stringify(orders));
  }, [orders]);

  // Save wishlist to local storage on change
  useEffect(() => {
    localStorage.setItem('nexstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save products to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('nexstore_products', JSON.stringify(products));
  }, [products]);

  // Save categories to local storage
  useEffect(() => {
    localStorage.setItem('nexstore_categories', JSON.stringify(categories));
  }, [categories]);

  // --- Category Management ---

  const addCategory = (name: string) => {
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const updateCategory = (oldName: string, newName: string) => {
    if (!newName || categories.includes(newName)) return;
    
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    
    // Update category name in products
    setProducts(prev => prev.map(p => 
      p.category === oldName ? { ...p, category: newName } : p
    ));
    
    // Update category name in cart
    setCart(prev => prev.map(item => 
      item.category === oldName ? { ...item, category: newName } : item
    ));

    // Update category name in wishlist
    setWishlist(prev => prev.map(item => 
      item.category === oldName ? { ...item, category: newName } : item
    ));
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
  };

  // --- Product Management ---

  const addProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      ...newProductData,
      id: newId,
      rating: 0,
      reviews: 0
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const updateProductPrice = (id: number, newPrice: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, price: newPrice } : p
    ));
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
    setWishlist(prev => prev.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
  };

  // --- Order Management ---

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  // --- User Profile Management ---

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('nexstore_user_profile', JSON.stringify(profile));
  };

  // --- Cart Management ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- Wishlist Management ---

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (isInWishlist(product.id)) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <ShopContext.Provider value={{ 
      products,
      cart, 
      orders,
      wishlist,
      categories,
      userProfile,
      isCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      toggleCart,
      cartTotal,
      cartCount,
      addProduct,
      deleteProduct,
      updateProductPrice,
      toggleWishlist,
      isInWishlist,
      addCategory,
      updateCategory,
      deleteCategory,
      addOrder,
      updateUserProfile
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};
