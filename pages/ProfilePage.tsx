import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { User, MapPin, Package, Edit2, Save, X, Camera, Mail, ShoppingBag } from 'lucide-react';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile, orders } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Form State
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    bio: '',
    avatar: ''
  });

  // Load profile data into form when editing starts or profile changes
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
        // If not in edit mode, save immediately
        if (!isEditing && userProfile) {
          updateUserProfile({ ...userProfile, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    if (userProfile) {
      setFormData(userProfile);
    }
    setIsEditing(false);
  };

  // Filter orders for this user
  const userOrders = orders.filter(o => 
    userProfile?.email && o.customer.email.toLowerCase() === userProfile.email.toLowerCase()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Profile Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg border border-slate-100 dark:border-neutral-800 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gold-600 dark:to-orange-600 opacity-90"></div>
          
          <div className="relative flex flex-col sm:flex-row items-end sm:items-center gap-6 mt-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-md bg-white dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-300 dark:text-gray-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 dark:bg-gold-500 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {userProfile?.name || 'Guest User'}
              </h1>
              <p className="text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {userProfile?.email || 'No email provided'}
              </p>
            </div>

            <div className="flex gap-3">
               {!userProfile && (
                 <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 px-4 py-2 rounded-xl text-sm font-medium">
                    Profile not saved
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-gold-500 shadow-sm border border-slate-100 dark:border-neutral-800' 
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'orders' 
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-gold-500 shadow-sm border border-slate-100 dark:border-neutral-800' 
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Package className="w-5 h-5 mr-3" />
              Order History
              {userOrders.length > 0 && (
                <span className="ml-auto bg-indigo-100 dark:bg-gold-500/20 text-indigo-600 dark:text-gold-500 text-xs py-0.5 px-2 rounded-full">
                  {userOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-sm font-medium text-indigo-600 dark:text-gold-500 hover:text-indigo-800 dark:hover:text-gold-400"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                       <button onClick={cancelEdit} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><X className="w-5 h-5" /></button>
                       <button onClick={handleSubmit} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"><Save className="w-5 h-5" /></button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      disabled={!isEditing}
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-neutral-800 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-indigo-500 dark:text-gold-500" />
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Address</label>
                        <input
                          type="text"
                          name="address"
                          disabled={!isEditing}
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">City</label>
                        <input
                          type="text"
                          name="city"
                          disabled={!isEditing}
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all"
                          placeholder="Metropolis"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          disabled={!isEditing}
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-neutral-900/50 text-slate-900 dark:text-white transition-all"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {userOrders.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-neutral-800">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No orders yet</h3>
                    <p className="text-slate-500 dark:text-gray-400 mb-6">Start shopping to see your orders here.</p>
                    <Link 
                      to="/shop" 
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-gold-500 dark:hover:bg-gold-600 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  userOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/30 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Order Placed</span>
                           <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total</span>
                           <span className="text-sm font-medium text-slate-900 dark:text-white">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Order #</span>
                           <span className="text-sm font-medium text-slate-900 dark:text-white">{order.id}</span>
                        </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                           order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 
                           order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
                           'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                         }`}>
                           {order.status}
                         </span>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
