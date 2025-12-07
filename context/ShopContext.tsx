import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, UserProfile, FAQItem, SiteContent } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

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
  updateProduct: (id: number, updates: Partial<Product>) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void; // New function specifically for deletion
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderDetails: (orderId: string, location: string, note: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  logoutCustomer: () => void;
  getDiscountedPrice: (price: number, discount: number) => number;
  // Banner Management
  bannerImages: string[];
  bannerInterval: number;
  addBannerImage: (image: string) => void;
  removeBannerImage: (index: number) => void;
  updateBannerInterval: (interval: number) => void;
  // CMS Content
  siteContent: SiteContent;
  updateSiteContent: (key: keyof SiteContent, content: string) => void;
  faqs: FAQItem[];
  addFaq: (question: string, answer: string) => void;
  updateFaq: (id: string, question: string, answer: string) => void;
  deleteFaq: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Lifestyle'];

const DEFAULT_BANNERS: string[] = [];

const DEFAULT_CONTENT: SiteContent = {
  privacyPolicy: "At NexStore, we value your privacy. This policy details how we collect, use, and protect your personal information...",
  termsConditions: "Welcome to NexStore. By using our website, you agree to comply with and be bound by the following terms and conditions...",
  returnPolicy: "We want you to be completely satisfied with your purchase. You can return items within 30 days of delivery...",
  cookiePolicy: "This website uses cookies to ensure you get the best experience on our website..."
};

const DEFAULT_FAQS: FAQItem[] = [
  { id: '1', question: 'How do I track my order?', answer: 'You can track your order in your Profile under Order History.' },
  { id: '2', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and UPI.' }
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize products from local storage or fall back to MOCK_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('nexstore_products');
    let loadedProducts = savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS;
    
    // Migration: Ensure new fields exist on old data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadedProducts = loadedProducts.map((p: any) => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : 50,
      discount: p.discount !== undefined ? p.discount : 0
    }));

    return loadedProducts;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('nexstore_categories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('nexstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('nexstore_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('nexstore_orders');
    let loadedOrders = savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
    
    // Auto-cleanup: Remove old John Doe mock orders (IDs 48792 and 48710) 
    // to ensure user doesn't see them if they are persisted in local storage.
    loadedOrders = loadedOrders.filter((o: Order) => o.id !== '48792' && o.id !== '48710');

    return loadedOrders;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('nexstore_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Auto-cleanup: If the saved profile is the old mock "John Doe", clear it.
      if (parsed.email === 'john@example.com' && parsed.name === 'John Doe') {
        localStorage.removeItem('nexstore_user_profile');
        return null;
      }
      return parsed;
    }
    return null;
  });

  // Banner State
  const [bannerImages, setBannerImages] = useState<string[]>(() => {
    const savedBanners = localStorage.getItem('nexstore_banner_images');
    return savedBanners ? JSON.parse(savedBanners) : DEFAULT_BANNERS;
  });

  const [bannerInterval, setBannerInterval] = useState<number>(() => {
    const savedInterval = localStorage.getItem('nexstore_banner_interval');
    return savedInterval ? parseInt(savedInterval, 10) : 5000;
  });

  // CMS State
  const [siteContent, setSiteContentState] = useState<SiteContent>(() => {
    const savedContent = localStorage.getItem('nexstore_content');
    return savedContent ? JSON.parse(savedContent) : DEFAULT_CONTENT;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const savedFaqs = localStorage.getItem('nexstore_faqs');
    return savedFaqs ? JSON.parse(savedFaqs) : DEFAULT_FAQS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Save user profile to local storage
  useEffect(() => {
    if (userProfile) {
        localStorage.setItem('nexstore_user_profile', JSON.stringify(userProfile));
    } else {
        localStorage.removeItem('nexstore_user_profile');
    }
  }, [userProfile]);

  // Save banners to local storage
  useEffect(() => {
    localStorage.setItem('nexstore_banner_images', JSON.stringify(bannerImages));
  }, [bannerImages]);

  // Save banner interval to local storage
  useEffect(() => {
    localStorage.setItem('nexstore_banner_interval', bannerInterval.toString());
  }, [bannerInterval]);

  // Save CMS Content
  useEffect(() => {
    localStorage.setItem('nexstore_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('nexstore_faqs', JSON.stringify(faqs));
  }, [faqs]);


  // --- Helpers ---
  const getDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - (discount || 0) / 100);
  };

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

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
    // Also update cart items if they match this product
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    // Also update wishlist items
    setWishlist(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // --- Order Management ---

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Decrease stock for ordered items
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProduct(product.id, { stock: Math.max(0, product.stock - item.quantity) });
      }
    });
  };

  // Strictly for removing an order from the array (Admin use or final step of cancel)
  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => String(order.id) !== String(orderId)));
  };

  // Customer facing cancel - performs checks and restores stock
  const cancelOrder = (orderId: string) => {
    // Force string comparison for IDs to avoid mismatch between string vs number types
    const orderToCancel = orders.find(o => String(o.id) === String(orderId));
    
    // Safety check
    if (!orderToCancel) {
        console.warn(`Order ${orderId} not found`);
        return;
    }

    // Only allow cancelling if it's Pending or Processing. 
    // If it's shipped or delivered, we stop here.
    if (['Shipped', 'Delivered'].includes(orderToCancel.status)) {
      alert('Order cannot be cancelled as it has already been shipped or delivered.');
      return;
    }

    // Restore stock in a single batch update to prevent race conditions
    setProducts(currentProducts => {
      return currentProducts.map(product => {
        // Check if this product is in the cancelled order
        const itemInOrder = orderToCancel.items.find(item => item.id === product.id);
        if (itemInOrder) {
          // Restore stock
          return { ...product, stock: product.stock + itemInOrder.quantity };
        }
        return product;
      });
    });

    // Remove the order using the delete helper
    deleteOrder(orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const updateOrderDetails = (orderId: string, location: string, note: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, currentLocation: location, adminNote: note } : order
    ));
  };

  // --- User Profile Management ---

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const logoutCustomer = () => {
    setUserProfile(null);
  };

  // --- Banner Management ---

  const addBannerImage = (image: string) => {
    if (bannerImages.length < 10) {
      setBannerImages(prev => [...prev, image]);
    }
  };

  const removeBannerImage = (index: number) => {
    setBannerImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateBannerInterval = (interval: number) => {
    setBannerInterval(interval);
  };

  // --- CMS & FAQ Management ---

  const updateSiteContent = (key: keyof SiteContent, content: string) => {
    setSiteContentState(prev => ({ ...prev, [key]: content }));
  };

  const addFaq = (question: string, answer: string) => {
    const newFaq: FAQItem = {
      id: Date.now().toString(),
      question,
      answer
    };
    setFaqs(prev => [...prev, newFaq]);
  };

  const updateFaq = (id: string, question: string, answer: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, question, answer } : f));
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  // --- Cart Management ---

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
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
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= product.stock) {
           return { ...item, quantity: newQty };
        }
        return item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);
    return total + (discountedPrice * item.quantity);
  }, 0);

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
      updateProduct,
      toggleWishlist,
      isInWishlist,
      addCategory,
      updateCategory,
      deleteCategory,
      addOrder,
      cancelOrder,
      deleteOrder,
      updateOrderStatus,
      updateOrderDetails,
      updateUserProfile,
      logoutCustomer,
      getDiscountedPrice,
      bannerImages,
      bannerInterval,
      addBannerImage,
      removeBannerImage,
      updateBannerInterval,
      siteContent,
      updateSiteContent,
      faqs,
      addFaq,
      updateFaq,
      deleteFaq
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