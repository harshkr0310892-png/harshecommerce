import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity backdrop-blur-sm" 
        onClick={toggleCart}
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-xl flex flex-col h-full animate-slide-in-right border-l dark:border-neutral-800">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3 text-indigo-600 dark:text-gold-500" />
              Shopping Cart
            </h2>
            <button 
              onClick={toggleCart} 
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-full mb-4">
                   <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-neutral-600" />
                </div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                <button 
                  onClick={toggleCart}
                  className="mt-6 text-white bg-indigo-600 dark:bg-gold-500 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 dark:hover:bg-gold-600 transition-all hover:-translate-y-0.5"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex py-2 group">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="ml-5 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 pr-4">{item.name}</h3>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 py-1 text-sm font-medium text-gray-900 dark:text-white min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 dark:border-neutral-800 px-6 py-6 bg-white dark:bg-neutral-900">
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white mb-2">
                <p>Subtotal</p>
                <p>₹{cartTotal.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center rounded-xl border border-transparent bg-indigo-600 dark:bg-gold-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/20 dark:shadow-gold-500/20 hover:bg-indigo-700 dark:hover:bg-gold-600 transition-all hover:-translate-y-0.5"
              >
                Checkout
              </button>
              <div className="mt-4 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  or{' '}
                  <button
                    type="button"
                    className="font-medium text-indigo-600 dark:text-gold-500 hover:text-indigo-500 dark:hover:text-gold-400"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
