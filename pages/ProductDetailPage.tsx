import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingCart, Star, ArrowLeft, Check, Truck, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, products, getDiscountedPrice } = useShop(); // Get dynamic products
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The product you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-indigo-600 dark:bg-gold-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-gold-600 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center mb-8 text-sm text-gray-500 dark:text-gray-400">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center hover:text-indigo-600 dark:hover:text-gold-500 mr-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-indigo-600 dark:hover:text-gold-500">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm relative">
              <img
                src={selectedImage}
                alt={product.name}
                className={`w-full h-full object-cover object-center transition-all duration-300 ${isSoldOut ? 'grayscale' : ''}`}
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white/90 dark:bg-neutral-900/90 text-slate-900 dark:text-white px-6 py-3 font-bold uppercase tracking-widest text-lg rounded-xl shadow-lg border border-white/20">
                    Sold Out
                  </span>
                </div>
              )}
              {!isSoldOut && product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img 
                        ? 'border-indigo-600 dark:border-gold-500 opacity-100 ring-2 ring-indigo-600/20 dark:ring-gold-500/20' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className={`w-full h-full object-cover ${isSoldOut ? 'grayscale' : ''}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-gold-500/10 text-indigo-800 dark:text-gold-400 w-fit mb-4">
              {product.category}
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-yellow-400 dark:text-gold-400 fill-current' : 'text-gray-300 dark:text-neutral-700'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({product.reviews} verified reviews)
              </span>
            </div>

            <div className="mb-8">
               {product.discount > 0 ? (
                 <div className="flex flex-col">
                    <span className="text-xl text-slate-400 dark:text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                      ₹{discountedPrice.toLocaleString('en-IN')}
                    </span>
                 </div>
               ) : (
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
               )}
            </div>

            <div className="prose prose-sm sm:prose-base text-gray-600 dark:text-gray-300 mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => addToCart(product)}
                disabled={isSoldOut}
                className={`w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg transform active:scale-95 ${
                  isSoldOut
                    ? 'bg-gray-300 dark:bg-neutral-700 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 dark:bg-gold-500 text-white hover:bg-indigo-700 dark:hover:bg-gold-600 dark:shadow-gold-900/20'
                }`}
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Truck className="w-5 h-5 mr-3 text-indigo-500 dark:text-gold-500" />
                  Free shipping on orders over ₹1,000
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="w-5 h-5 mr-3 text-indigo-500 dark:text-gold-500" />
                  2-year warranty included
                </div>
                
                {isSoldOut ? (
                   <div className="flex items-center text-sm text-red-500 font-medium">
                    <XCircle className="w-5 h-5 mr-3" />
                    Currently Out of Stock
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center text-sm text-amber-500 font-medium animate-pulse">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    Hurry! Only {product.stock} left in stock
                  </div>
                ) : (
                   <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5 mr-3" />
                    In stock and ready to ship
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-200 dark:border-neutral-800 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
