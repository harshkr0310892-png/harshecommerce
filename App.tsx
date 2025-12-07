import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { AIAssistant } from './components/AIAssistant';
import { Hero } from './components/Hero';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductCard } from './components/ProductCard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const HomePageContent: React.FC = () => {
  const { products } = useShop();

  return (
    <div className="pb-20">
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Collections</h2>
            <p className="mt-1 text-slate-500 dark:text-gray-400">Handpicked items just for you</p>
          </div>
          <a href="#/shop" className="text-indigo-600 dark:text-gold-500 font-medium hover:text-indigo-800 dark:hover:text-gold-400 flex items-center group">
            View all <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="bg-indigo-900 dark:bg-neutral-900 py-20 text-white border-t border-indigo-800 dark:border-neutral-800 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-gold-500">Why Shop With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 bg-indigo-800/50 dark:bg-neutral-800/50 rounded-2xl backdrop-blur-sm border border-indigo-700/50 dark:border-neutral-700 transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-500 dark:bg-gold-600 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-indigo-900/20">🚀</div>
              <h3 className="text-xl font-bold mb-3">Fast Shipping</h3>
              <p className="text-indigo-200 dark:text-gray-400 leading-relaxed">Free delivery on all orders over $50. We ship worldwide with tracking.</p>
            </div>
            <div className="p-8 bg-indigo-800/50 dark:bg-neutral-800/50 rounded-2xl backdrop-blur-sm border border-indigo-700/50 dark:border-neutral-700 transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-500 dark:bg-gold-600 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-indigo-900/20">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
              <p className="text-indigo-200 dark:text-gray-400 leading-relaxed">100% secure payment with encrypted checkout and buyer protection.</p>
            </div>
            <div className="p-8 bg-indigo-800/50 dark:bg-neutral-800/50 rounded-2xl backdrop-blur-sm border border-indigo-700/50 dark:border-neutral-700 transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-500 dark:bg-gold-600 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-indigo-900/20">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Assistance</h3>
              <p className="text-indigo-200 dark:text-gray-400 leading-relaxed">Smart recommendations tailored just for you by our advanced AI model.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isCartOpen } = useShop(); // Hook to check cart state

  // Hide AI Assistant on Admin, Checkout pages, OR when Cart is open
  const isAIHidden = 
    ['/admin', '/checkout'].some(path => location.pathname.startsWith(path)) || 
    isCartOpen;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />
      <CartDrawer />
      {!isAIHidden && <AIAssistant />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePageContent />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<HomePageContent />} />
        </Routes>
      </main>
      <footer className="bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-gray-400 text-sm">
          <p className="font-medium">&copy; 2024 NexStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ShopProvider>
          <Router>
            <AppLayout />
          </Router>
        </ShopProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;