import React from 'react';
import { ShoppingBag, Search, Menu, Sun, Moon, Settings, Heart, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { toggleCart, cartCount, wishlist, userProfile } = useShop();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-neutral-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 dark:bg-gold-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-gold-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-gold-500 transition-colors">NexStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-gold-400 font-medium transition-colors text-sm uppercase tracking-wide">Home</Link>
            <Link to="/shop" className="text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-gold-400 font-medium transition-colors text-sm uppercase tracking-wide">Shop</Link>
            <Link to="/about" className="text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-gold-400 font-medium transition-colors text-sm uppercase tracking-wide">About</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/admin" className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors hidden sm:block hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full" title="Admin Dashboard">
               <Settings className="w-5 h-5" />
            </Link>

            <Link to="/wishlist" className="relative p-2 text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors hidden sm:block hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full group">
               <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
               {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

             <Link to="/profile" className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors hidden sm:block hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full" title="My Profile">
               {userProfile?.avatar ? (
                 <div className="w-5 h-5 rounded-full overflow-hidden ring-2 ring-indigo-100 dark:ring-neutral-700">
                    <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                 </div>
               ) : (
                 <User className="w-5 h-5" />
               )}
            </Link>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors hidden sm:block hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={toggleCart} 
              className="relative p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors group hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 dark:bg-gold-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="md:hidden">
              <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
