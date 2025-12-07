import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className={`group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl dark:hover:shadow-gold-900/10 transition-all duration-300 border border-slate-100 dark:border-neutral-800 ${compact ? 'text-sm' : ''}`}>
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <div className={`aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 dark:bg-neutral-800 ${compact ? 'h-32' : 'h-64'}`}>
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition-all z-10 hover:scale-110 active:scale-95"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-slate-400 dark:text-gray-500 hover:text-red-500'}`} 
          />
        </button>

        {!compact && (
           <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-slate-700 dark:text-gray-200">{product.rating}</span>
              </div>
           </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/product/${product.id}`}>
                 <h3 className={`font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-gold-500 transition-colors ${compact ? 'text-sm' : 'text-lg'}`}>
                  {product.name}
                </h3>
              </Link>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mt-1.5">{product.category}</p>
            </div>
          </div>
          {!compact && (
            <div className="mt-3 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'text-yellow-400 dark:text-gold-400 fill-current' : 'text-gray-300 dark:text-neutral-700'}`} 
                />
              ))}
              <span className="ml-2 text-xs text-slate-400 dark:text-gray-500">({product.reviews} reviews)</span>
            </div>
          )}
          {!compact && (
            <p className="mt-3 text-sm text-slate-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{product.description}</p>
          )}
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <p className={`font-bold text-slate-900 dark:text-white ${compact ? 'text-base' : 'text-xl'}`}>
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center rounded-full bg-indigo-600 dark:bg-gold-500 p-2.5 text-white hover:bg-indigo-700 dark:hover:bg-gold-600 transition-all hover:shadow-lg shadow-indigo-500/20 dark:shadow-gold-500/20 focus:outline-none active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
