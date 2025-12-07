import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, Sun, Moon, Settings, Heart, User, X, LogIn } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { toggleCart, cartCount, wishlist, userProfile } = useShop();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

             {userProfile ? (
               <Link to="/profile" className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 transition-colors hidden sm:block hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full" title="My Profile">
                 {userProfile.avatar ? (
                   <div className="w-5 h-5 rounded-full overflow-hidden ring-2 ring-indigo-100 dark:ring-neutral-700">
                      <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                   </div>
                 ) : (
                   <User className="w-5 h-5" />
                 )}
              </Link>
             ) : (
               <Link to="/customer-login" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-gold-500 rounded-full hover:bg-indigo-700 dark:hover:bg-gold-600 transition-colors shadow-sm">
                 <LogIn className="w-4 h-4" />
                 Sign In
               </Link>
             )}

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
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gold-400 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-neutral-800 absolute w-full z-50 animate-fade-in-down shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">Shop</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">About</Link>
            
            <div className="border-t border-slate-200 dark:border-neutral-800 my-2 pt-2 space-y-2">
               {userProfile ? (
                 <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">
                    <User className="w-5 h-5 mr-3" /> Profile
                 </Link>
               ) : (
                 <Link to="/customer-login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">
                    <LogIn className="w-5 h-5 mr-3" /> Sign In
                 </Link>
               )}
               <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">
                  <Heart className="w-5 h-5 mr-3" /> Wishlist
                  {wishlist.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>}
               </Link>
               <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all">
                  <Settings className="w-5 h-5 mr-3" /> Admin Dashboard
               </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};