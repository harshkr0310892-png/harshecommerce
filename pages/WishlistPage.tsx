import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useShop();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-10">
           <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl mr-4">
             <Heart className="w-8 h-8 text-red-500 dark:text-red-400 fill-current" />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
             <p className="text-slate-500 dark:text-gray-400 mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
           </div>
        </div>

        {wishlist.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 text-center px-4">
             <div className="w-24 h-24 bg-red-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Heart className="w-10 h-10 text-red-300 dark:text-red-900" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your wishlist is empty</h2>
             <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
               Seems like you haven't found anything you like yet. Browse our catalog and save your favorite items for later!
             </p>
             <Link 
               to="/shop" 
               className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg shadow-indigo-500/20 text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-gold-500 dark:hover:bg-gold-600 transition-all hover:-translate-y-1"
             >
               <ShoppingBag className="w-5 h-5 mr-2" />
               Start Shopping
             </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {wishlist.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
        )}
      </div>
    </div>
  );
};
