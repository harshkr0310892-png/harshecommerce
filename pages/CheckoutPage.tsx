import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Order, UserProfile } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, addOrder, userProfile, updateUserProfile } = useShop();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Pre-fill form from userProfile
  useEffect(() => {
    if (userProfile) {
      const [first, ...last] = userProfile.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: first || '',
        lastName: last.join(' ') || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        zipCode: userProfile.zipCode || ''
      }));
    }
  }, [userProfile]);

  useEffect(() => {
    // If cart is empty and not success state, redirect
    if (cart.length === 0 && !isSuccess) {
      navigate('/shop');
    }
  }, [cart, isSuccess, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedId = (Math.random() * 100000).toFixed(0);
      setOrderId(generatedId);

      const customerName = `${formData.firstName} ${formData.lastName}`.trim();

      const newOrder: Order = {
        id: generatedId,
        customer: {
          name: customerName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        items: [...cart], // Copy current cart items
        total: cartTotal,
        date: new Date().toISOString(),
        status: 'Pending'
      };

      addOrder(newOrder);

      // Save/Update User Profile automatically
      const updatedProfile: UserProfile = {
        name: customerName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        avatar: userProfile?.avatar,
        bio: userProfile?.bio
      };
      updateUserProfile(updatedProfile);

      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl text-center border border-slate-100 dark:border-neutral-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 dark:text-gray-400 mb-8">
            Thank you for your purchase. Your order <span className="font-mono font-bold text-indigo-600 dark:text-gold-500">#{orderId}</span> has been received and is being processed.
          </p>
          <div className="space-y-3">
             <button 
              onClick={() => navigate('/profile')}
              className="w-full py-4 border-2 border-indigo-600 dark:border-gold-500 text-indigo-600 dark:text-gold-500 bg-transparent rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all"
            >
              View Order in Profile
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-indigo-600 dark:bg-gold-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-gold-600 transition-all shadow-lg shadow-indigo-500/20"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
          <ShieldCheck className="w-8 h-8 mr-3 text-indigo-600 dark:text-gold-500" />
          Checkout Securely
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Shipping Details */}
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-indigo-500 dark:text-gold-500" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Email Address</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">ZIP Code</label>
                    <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-indigo-500 dark:text-gold-500" />
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Card Number</label>
                    <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Expiry Date</label>
                    <input required name="expiry" value={formData.expiry} onChange={handleInputChange} type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">CVC</label>
                    <input required name="cvc" value={formData.cvc} onChange={handleInputChange} type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 focus:ring-0 text-slate-900 dark:text-white transition-all" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-indigo-500 dark:text-gold-500" />
                Order Summary
              </h2>
              
              <div className="max-h-80 overflow-y-auto pr-2 mb-6 custom-scrollbar space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-slate-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-neutral-800 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-slate-600 dark:text-gray-400">
                  <p>Subtotal</p>
                  <p>₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-gray-400">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-neutral-800">
                  <p>Total</p>
                  <p>₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full mt-8 flex items-center justify-center rounded-xl bg-indigo-600 dark:bg-gold-500 py-4 px-6 text-base font-bold text-white shadow-lg shadow-indigo-500/20 dark:shadow-gold-500/20 hover:bg-indigo-700 dark:hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    Place Order <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
