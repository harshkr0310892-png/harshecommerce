import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, SiteContent } from '../types';
import { Trash2, Edit2, Plus, Save, X, LogOut, Package, Tag, Check, LayoutGrid, Upload, Image as ImageIcon, ClipboardList, Clock, MapPin, Mail, User as UserIcon, BarChart3, TrendingUp, Globe, Settings, PlayCircle, Calendar, DollarSign, ShoppingBag, MessageSquare, Truck, FileText, HelpCircle, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    categories, 
    orders,
    addProduct, 
    deleteProduct, 
    updateProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updateOrderDetails,
    deleteOrder, // Use the new deleteOrder function
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
  } = useShop();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reach' | 'banners' | 'sales' | 'cms'>('inventory');
  
  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    discount: '',
    category: '',
    description: '',
  });

  // State for product images
  const [newImages, setNewImages] = useState<string[]>([]);

  // State for banner image upload
  const [newBannerImage, setNewBannerImage] = useState<string | null>(null);
  const [tempInterval, setTempInterval] = useState(bannerInterval / 1000); // Display in seconds

  // State for category management
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // State for editing product
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ price: string, stock: string, discount: string }>({ price: '', stock: '', discount: '' });

  // State for Order Logistics editing
  const [editingOrderLogistics, setEditingOrderLogistics] = useState<{id: string, location: string, note: string} | null>(null);

  // State for CMS
  const [selectedPolicy, setSelectedPolicy] = useState<keyof SiteContent>('privacyPolicy');
  const [contentDraft, setContentDraft] = useState('');
  const [isEditingContent, setIsEditingContent] = useState(false);
  
  // State for FAQ
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState({ question: '', answer: '' });

  // Initialize new product category with the first available category
  React.useEffect(() => {
    if (categories.length > 0 && !newProduct.category) {
      setNewProduct(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, newProduct.category]);

  // Load content into draft when policy selection changes
  React.useEffect(() => {
    setContentDraft(siteContent[selectedPolicy]);
    setIsEditingContent(false);
  }, [selectedPolicy, siteContent]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 7 - newImages.length;
      
      if (files.length > remainingSlots) {
        alert(`You can only upload a maximum of 7 images. You can add ${remainingSlots} more.`);
        return;
      }

      // Convert files to Base64
      const promises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(base64Images => {
        setNewImages(prev => [...prev, ...base64Images]);
      });
      
      // Reset input value to allow re-selecting same files if needed
      e.target.value = '';
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const submitBanner = () => {
    if (newBannerImage) {
      if (bannerImages.length >= 10) {
        alert("Maximum 10 banners allowed. Please remove one first.");
        return;
      }
      addBannerImage(newBannerImage);
      setNewBannerImage(null);
    }
  };

  const handleIntervalChange = () => {
     updateBannerInterval(tempInterval * 1000);
     alert("Interval updated successfully!");
  };

  const removeImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || newImages.length === 0 || !newProduct.category) {
      alert("Please fill in all fields and upload at least one image.");
      return;
    }

    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      discount: parseFloat(newProduct.discount) || 0,
      category: newProduct.category,
      description: newProduct.description,
      image: newImages[0], // Main image is the first one
      images: newImages // All images
    });

    // Reset form
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      discount: '',
      category: categories[0] || '',
      description: '',
    });
    setNewImages([]);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const startEditingCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryName(cat);
  };

  const saveCategory = () => {
    if (editingCategory && editCategoryName.trim()) {
      updateCategory(editingCategory, editCategoryName.trim());
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: product.discount.toString()
    });
  };

  const saveProductUpdate = (id: number) => {
    updateProduct(id, {
      price: parseFloat(editForm.price),
      stock: parseInt(editForm.stock),
      discount: parseFloat(editForm.discount)
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const startEditingLogistics = (order: Order) => {
    setEditingOrderLogistics({
      id: order.id,
      location: order.currentLocation || '',
      note: order.adminNote || ''
    });
  };

  const saveOrderLogistics = () => {
    if (editingOrderLogistics) {
      updateOrderDetails(editingOrderLogistics.id, editingOrderLogistics.location, editingOrderLogistics.note);
      setEditingOrderLogistics(null);
    }
  };

  const handleSavePolicy = () => {
    updateSiteContent(selectedPolicy, contentDraft);
    setIsEditingContent(false);
    alert('Policy updated successfully!');
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      addFaq(newFaq.question, newFaq.answer);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const startEditingFaq = (faq: {id: string, question: string, answer: string}) => {
    setEditingFaqId(faq.id);
    setEditFaqForm({ question: faq.question, answer: faq.answer });
  };

  const saveFaq = () => {
    if (editingFaqId && editFaqForm.question && editFaqForm.answer) {
      updateFaq(editingFaqId, editFaqForm.question, editFaqForm.answer);
      setEditingFaqId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- REACH / ANALYTICS DATA ---
  const reachData = useMemo(() => {
    const cityStats: Record<string, { count: number; revenue: number }> = {};
    
    orders.forEach(order => {
      if (order.status === 'Cancelled') return;
      const city = order.customer.city.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Unknown';
      if (!cityStats[city]) {
        cityStats[city] = { count: 0, revenue: 0 };
      }
      cityStats[city].count += 1;
      cityStats[city].revenue += order.total;
    });

    return Object.entries(cityStats)
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // --- SALES ANALYTICS DATA ---
  const { monthlyStats, yearlyStats, maxMonthlyItems } = useMemo(() => {
    const monthly: Record<string, { name: string; items: number; revenue: number; orderCount: number; date: Date }> = {};
    const yearly: Record<string, { year: number; items: number; revenue: number; orderCount: number }> = {};
    let maxItems = 0;

    orders.forEach(order => {
      if (order.status === 'Cancelled') return;
      const date = new Date(order.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthly[monthKey]) {
        monthly[monthKey] = {
          name: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
          items: 0,
          revenue: 0,
          orderCount: 0,
          date: new Date(date.getFullYear(), date.getMonth(), 1)
        };
      }
      const yearKey = date.getFullYear().toString();
      if (!yearly[yearKey]) {
        yearly[yearKey] = {
          year: date.getFullYear(),
          items: 0,
          revenue: 0,
          orderCount: 0
        };
      }
      const itemsInOrder = order.items.reduce((sum, item) => sum + item.quantity, 0);
      monthly[monthKey].items += itemsInOrder;
      monthly[monthKey].revenue += order.total;
      monthly[monthKey].orderCount += 1;
      yearly[yearKey].items += itemsInOrder;
      yearly[yearKey].revenue += order.total;
      yearly[yearKey].orderCount += 1;
      if (monthly[monthKey].items > maxItems) maxItems = monthly[monthKey].items;
    });

    return {
      monthlyStats: Object.values(monthly).sort((a, b) => b.date.getTime() - a.date.getTime()),
      yearlyStats: Object.values(yearly).sort((a, b) => b.year - a.year),
      maxMonthlyItems: maxItems
    };
  }, [orders]);

  const totalRevenue = orders.reduce((acc, curr) => curr.status !== 'Cancelled' ? acc + curr.total : acc, 0);
  const totalOrders = orders.filter(o => o.status !== 'Cancelled').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600 dark:text-gold-500" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-slate-500 dark:text-gray-400 text-sm">Manage inventory, orders, analytics, and site content.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="w-full overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex space-x-2 bg-slate-100 dark:bg-neutral-900 p-1.5 rounded-xl min-w-max sm:w-fit">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
              {orders.length > 0 && (
                <span className="ml-2 bg-indigo-100 dark:bg-gold-500/20 text-indigo-600 dark:text-gold-500 text-xs px-2 py-0.5 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'sales'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Sales Analytics
            </button>
            <button
              onClick={() => setActiveTab('reach')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'reach'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Product Reach
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'banners'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Banners
            </button>
            <button
              onClick={() => setActiveTab('cms')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'cms'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-gold-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              CMS & FAQs
            </button>
          </div>
        </div>

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'inventory' && (
          // ... (existing inventory code unchanged)
          <div className="space-y-8 animate-fade-in">
             {/* ... Inventory Content ... */}
             <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Add Product Section */}
              <div className="xl:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                {/* ... (Add Product Form Code) ... */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-gold-500/20 rounded-lg flex items-center justify-center mr-3">
                     <Plus className="w-5 h-5 text-indigo-600 dark:text-gold-500" />
                  </div>
                  Add New Product
                </h2>
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 px-4 py-3 transition-all"
                      placeholder="e.g. Super Widget"
                    />
                  </div>

                  <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Price (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">₹</span>
                      </div>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 pl-8 pr-4 py-3 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 px-4 py-3 transition-all appearance-none"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 px-4 py-3 transition-all"
                      placeholder="e.g. 50"
                    />
                  </div>

                   <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discount}
                      onChange={e => setNewProduct({...newProduct, discount: e.target.value})}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 px-4 py-3 transition-all"
                      placeholder="e.g. 10"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="md:col-span-3 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">
                      Product Images (Max 7)
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-neutral-700 border-dashed rounded-xl hover:border-indigo-500 dark:hover:border-gold-500 transition-colors bg-slate-50 dark:bg-neutral-800/50">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 dark:text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-gold-500 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          PNG, JPG, GIF up to 5MB each
                        </p>
                      </div>
                    </div>
                    {newImages.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4">
                        {newImages.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-700">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {idx === 0 && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-gold-500/20 px-4 py-3 transition-all"
                      placeholder="Product details..."
                    />
                  </div>

                  <div className="md:col-span-3 pt-2">
                    <button
                      type="submit"
                      disabled={newImages.length === 0}
                      className="w-full inline-flex justify-center items-center py-3.5 px-4 border border-transparent shadow-md text-sm font-bold rounded-xl text-white bg-indigo-600 dark:bg-gold-500 hover:bg-indigo-700 dark:hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Product to Inventory
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Management */}
              <div className="xl:col-span-1 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                 {/* ... (Category Management Code) ... */}
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                     <LayoutGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Categories
                </h2>
                <form onSubmit={handleAddCategory} className="mb-6">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New..." 
                      className="flex-1 rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/20"
                    />
                    <button 
                      type="submit"
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </form>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map(cat => (
                    <div key={cat} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-neutral-700">
                      {editingCategory === cat ? (
                        <div className="flex items-center flex-1 gap-2">
                          <input 
                            type="text" 
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="flex-1 rounded-lg border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button onClick={saveCategory} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingCategory(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{cat}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditingCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-gold-500 hover:bg-indigo-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Inventory List */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
               {/* ... (Inventory List Code) ... */}
               <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Inventory <span className="text-slate-500 font-normal">({products.length} items)</span></h2>
              </div>
              <div className="block sm:hidden divide-y divide-slate-100 dark:divide-neutral-800">
                {products.map((product) => (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</div>
                            <div className="text-xs text-slate-500">#{product.id} • {product.category}</div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                           <button onClick={() => startEditing(product)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                    {editingId === product.id ? (
                      <div className="bg-slate-50 dark:bg-neutral-800 p-3 rounded-xl space-y-3">
                         <div className="grid grid-cols-2 gap-2">
                           <div>
                              <label className="text-xs text-slate-500">Price</label>
                              <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full text-sm p-1 rounded border" />
                           </div>
                           <div>
                              <label className="text-xs text-slate-500">Stock</label>
                              <input type="number" value={editForm.stock} onChange={(e) => setEditForm({...editForm, stock: e.target.value})} className="w-full text-sm p-1 rounded border" />
                           </div>
                         </div>
                         <div>
                            <label className="text-xs text-slate-500">Discount %</label>
                            <input type="number" value={editForm.discount} onChange={(e) => setEditForm({...editForm, discount: e.target.value})} className="w-full text-sm p-1 rounded border" />
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => saveProductUpdate(product.id)} className="flex-1 bg-green-500 text-white text-xs py-2 rounded">Save</button>
                             <button onClick={cancelEdit} className="flex-1 bg-gray-500 text-white text-xs py-2 rounded">Cancel</button>
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-slate-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                          <div className="text-xs text-slate-500">Price</div>
                          <div className="font-medium text-slate-900 dark:text-white">₹{product.price}</div>
                        </div>
                         <div className="bg-slate-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                          <div className="text-xs text-slate-500">Stock</div>
                          <div className={`font-medium ${product.stock < 10 ? 'text-amber-500' : 'text-green-600'}`}>{product.stock}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                          <div className="text-xs text-slate-500">Disc.</div>
                          <div className="font-medium text-red-500">{product.discount}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-neutral-800">
                  <thead className="bg-slate-50 dark:bg-neutral-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Price (₹)</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Discount (%)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-slate-100 dark:divide-neutral-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                        {/* Table row content - condensed for brevity as it's unchanged */}
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><img className="h-12 w-12 rounded-lg object-cover" src={product.image} alt="" /><div className="ml-4"><div className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</div><div className="text-xs text-slate-500">ID: #{product.id}</div></div></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-gold-500 border border-indigo-100 dark:border-neutral-700">{product.category}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{editingId === product.id ? <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-20 rounded border p-1" /> : `₹${product.price}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{editingId === product.id ? <input type="number" value={editForm.stock} onChange={(e) => setEditForm({...editForm, stock: e.target.value})} className="w-16 rounded border p-1" /> : <span className={product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : "text-green-600"}>{product.stock === 0 ? 'Out of Stock' : product.stock}</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{editingId === product.id ? <input type="number" value={editForm.discount} onChange={(e) => setEditForm({...editForm, discount: e.target.value})} className="w-16 rounded border p-1" /> : product.discount > 0 ? <span className="text-red-500">{product.discount}%</span> : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === product.id ? (
                            <div className="flex justify-end space-x-2"><button onClick={() => saveProductUpdate(product.id)} className="p-1.5 bg-green-50 text-green-600 rounded"><Save className="w-4 h-4" /></button><button onClick={cancelEdit} className="p-1.5 bg-gray-50 text-gray-600 rounded"><X className="w-4 h-4" /></button></div>
                          ) : (
                            <div className="flex justify-end space-x-2"><button onClick={() => startEditing(product)} className="p-2 text-indigo-600 rounded hover:bg-indigo-50"><Edit2 className="w-4 h-4" /></button><button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
             {orders.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-neutral-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Orders Yet</h3>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
                <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Orders <span className="text-slate-500 font-normal">({orders.length})</span></h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold text-indigo-600 dark:text-gold-500 font-mono">#{order.id}</span>
                            <div className="relative">
                               <select 
                                value={order.status} 
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`appearance-none px-3 py-1 pr-8 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-offset-1 cursor-pointer outline-none ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 focus:ring-green-500' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 focus:ring-blue-500' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 focus:ring-red-500' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 focus:ring-yellow-500'
                                }`}
                               >
                                 <option value="Pending">Pending</option>
                                 <option value="Processing">Processing</option>
                                 <option value="Shipped">Shipped</option>
                                 <option value="Delivered">Delivered</option>
                                 <option value="Cancelled">Cancelled</option>
                               </select>
                            </div>
                            <button 
                              onClick={() => {
                                if(window.confirm('Are you sure you want to PERMANENTLY delete this order?')) {
                                  deleteOrder(order.id); // Use deleteOrder instead of cancelOrder for admins
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors ml-auto md:ml-0"
                              title="Delete Order Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Visual Order Tracker - Admin Interactive */}
                          <div className="py-4 w-full">
                            <div className="relative">
                              <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-neutral-700 -z-0"></div>
                              <div className="flex justify-between w-full relative z-10">
                                {[
                                  { status: 'Pending', label: 'Placed', icon: ClipboardCheck },
                                  { status: 'Processing', label: 'Processing', icon: Package },
                                  { status: 'Shipped', label: 'Shipped', icon: Truck },
                                  { status: 'Delivered', label: 'Delivered', icon: MapPin }
                                ].map((step, idx) => {
                                   // Logic to determine state
                                   const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                                   const currentIdx = steps.indexOf(order.status);
                                   const stepIdx = steps.indexOf(step.status);
                                   
                                   let state = 'upcoming';
                                   if (order.status === 'Cancelled') state = 'cancelled';
                                   else if (currentIdx > stepIdx) state = 'completed';
                                   else if (currentIdx === stepIdx) state = 'current';

                                   const Icon = step.icon;
                                   
                                   return (
                                     <button 
                                        key={step.status}
                                        onClick={() => {
                                          if (order.status !== 'Cancelled') {
                                            updateOrderStatus(order.id, step.status as Order['status']);
                                          }
                                        }}
                                        disabled={order.status === 'Cancelled'}
                                        className={`flex flex-col items-center group ${order.status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 transition-transform'}`}
                                     >
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                          state === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                          state === 'current' ? 'bg-indigo-600 dark:bg-gold-500 border-indigo-600 dark:border-gold-500 text-white scale-110 shadow-lg' :
                                          'bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-600 text-slate-400'
                                        }`}>
                                           {state === 'completed' ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium transition-colors ${
                                          state === 'current' ? 'text-indigo-600 dark:text-gold-500 font-bold' :
                                          state === 'completed' ? 'text-green-600 dark:text-green-500' :
                                          'text-slate-400'
                                        }`}>
                                          {step.label}
                                        </span>
                                     </button>
                                   );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2 text-slate-600 dark:text-gray-300">
                              <UserIcon className="w-4 h-4 mt-0.5 text-slate-400" />
                              <div><p className="font-semibold text-slate-900 dark:text-white">{order.customer.name}</p><p className="text-xs break-all">{order.customer.email}</p></div>
                            </div>
                            <div className="flex items-start gap-2 text-slate-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                              <div><p>{order.customer.address}</p><p className="text-xs">{order.customer.city}, {order.customer.zipCode}</p></div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400"><Clock className="w-4 h-4" />{formatDate(order.date)}</div>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-slate-100 dark:border-neutral-700 space-y-3">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Truck className="w-4 h-4" /> Logistics & Communication</h4>
                              {editingOrderLogistics && editingOrderLogistics.id === order.id ? (
                                <div className="space-y-3">
                                  <div><label className="text-xs text-slate-500 block mb-1">Current Location</label><input type="text" value={editingOrderLogistics.location} onChange={(e) => setEditingOrderLogistics({...editingOrderLogistics, location: e.target.value})} className="w-full text-sm p-2 rounded-lg border bg-slate-50 dark:bg-neutral-800" /></div>
                                  <div><label className="text-xs text-slate-500 block mb-1">Message</label><textarea rows={2} value={editingOrderLogistics.note} onChange={(e) => setEditingOrderLogistics({...editingOrderLogistics, note: e.target.value})} className="w-full text-sm p-2 rounded-lg border bg-slate-50 dark:bg-neutral-800" /></div>
                                  <div className="flex gap-2"><button onClick={saveOrderLogistics} className="flex-1 bg-green-600 text-white text-xs py-2 rounded-lg">Save</button><button onClick={() => setEditingOrderLogistics(null)} className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded-lg">Cancel</button></div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                   <div className="text-sm"><span className="text-xs text-slate-400 block">Current Location:</span><span className="font-medium text-slate-800 dark:text-gray-200">{order.currentLocation || "Not set"}</span></div>
                                   <div className="text-sm"><span className="text-xs text-slate-400 block">Message to User:</span><span className="font-medium text-slate-800 dark:text-gray-200 italic">"{order.adminNote || "No message"}"</span></div>
                                   <button onClick={() => startEditingLogistics(order)} className="text-xs text-indigo-600 dark:text-gold-500 font-bold hover:underline flex items-center gap-1 mt-2"><Edit2 className="w-3 h-3" /> Update Details</button>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex-1 md:max-w-md bg-slate-50 dark:bg-neutral-800/50 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Items Purchased</h4>
                          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2 min-w-0"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-full text-xs font-bold">{item.quantity}</span><span className="truncate">{item.name}</span></div><span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-700 flex justify-between items-center"><span className="font-bold">Total Amount</span><span className="font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- SALES ANALYTICS TAB --- */}
        {activeTab === 'sales' && (
          // ... (existing sales analytics code)
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-slate-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-slate-500 dark:text-gray-400 font-medium">Monthly Top Sales</h3><div className="p-2 bg-blue-50 dark:bg-neutral-800 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5" /></div></div>
                  <div className="text-3xl font-bold">{maxMonthlyItems} <span className="text-sm font-normal text-slate-500">items</span></div>
               </div>
               {yearlyStats.length > 0 && (
                 <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-slate-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-slate-500 dark:text-gray-400 font-medium">Sales in {yearlyStats[0].year}</h3><div className="p-2 bg-green-50 rounded-lg text-green-600"><Calendar className="w-5 h-5" /></div></div>
                    <div className="text-3xl font-bold">{yearlyStats[0].items} <span className="text-sm font-normal text-slate-500">items</span></div>
                 </div>
               )}
             </div>
             <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8">
               <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Yearly Overview</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {yearlyStats.map((yearStat) => (
                    <div key={yearStat.year} className="bg-slate-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-slate-100 dark:border-neutral-700">
                       <div className="text-lg font-bold mb-1">{yearStat.year}</div>
                       <div className="flex flex-col gap-2 mt-4"><div className="flex justify-between items-center text-sm"><span>Items Sold</span><span className="font-bold">{yearStat.items}</span></div><div className="flex justify-between items-center text-sm"><span>Total Revenue</span><span className="font-bold text-indigo-600">₹{yearStat.revenue.toLocaleString('en-IN')}</span></div></div>
                    </div>
                  ))}
               </div>
             </div>
             <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-6 sm:p-8">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-500" /> Monthly Performance</h2>
                <div className="space-y-6">
                  {monthlyStats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                       <div className="w-24 flex-shrink-0"><span className="font-bold text-sm">{stat.name}</span></div>
                       <div className="flex-1"><div className="flex items-center gap-3"><div className="flex-1 h-3 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${maxMonthlyItems > 0 ? (stat.items / maxMonthlyItems) * 100 : 0}%` }}></div></div><span className="text-xs font-bold w-12 text-right">{stat.items} sold</span></div></div>
                       <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48 text-sm"><div className="text-right"><span className="block text-xs text-slate-400">Revenue</span><span className="font-bold text-indigo-600">₹{stat.revenue.toLocaleString('en-IN')}</span></div></div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
         )}

        {/* ... (Other tabs unchanged) ... */}
        {activeTab === 'reach' && (
          // ... (existing reach code)
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-slate-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between mb-4"><h3 className="text-slate-500 font-medium">Total Orders</h3><div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Package className="w-5 h-5" /></div></div><div className="text-3xl font-bold">{totalOrders}</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-slate-100 dark:border-neutral-800 shadow-sm">
                 <div className="flex items-center justify-between mb-4"><h3 className="text-slate-500 font-medium">Total Revenue</h3><div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp className="w-5 h-5" /></div></div><div className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-slate-100 dark:border-neutral-800 shadow-sm">
                 <div className="flex items-center justify-between mb-4"><h3 className="text-slate-500 font-medium">Cities Reached</h3><div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Globe className="w-5 h-5" /></div></div><div className="text-3xl font-bold">{reachData.length}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
               <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900"><h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-500" /> Reach by Location</h2></div>
                <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {reachData.map((item, index) => (
                      <div key={item.city} className="p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-4"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 font-bold text-sm">{index + 1}</div><div><h4 className="font-bold text-lg">{item.city}</h4><div className="w-full sm:w-64 h-2 bg-slate-100 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(item.revenue / totalRevenue) * 100}%` }}></div></div></div></div>
                           <div className="flex items-center gap-8"><div className="text-right"><p className="text-xs text-slate-500 font-medium uppercase">Orders</p><p className="font-bold">{item.count}</p></div><div className="text-right min-w-[100px]"><p className="text-xs text-slate-500 font-medium uppercase">Revenue</p><p className="font-bold text-indigo-600">₹{item.revenue.toLocaleString('en-IN')}</p></div></div>
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
          </div>
        )}

        {/* ... (Banners and CMS Tabs same as before) ... */}
        {activeTab === 'banners' && (
          // ... (existing banners code)
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                  <h2 className="text-xl font-bold mb-6 flex items-center"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3"><Plus className="w-5 h-5 text-blue-600" /></div>Add New Banner</h2>
                  <div className="space-y-6"><div><label className="block text-sm font-semibold mb-2">Upload Image (Max 10)</label><div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-neutral-700 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-neutral-800/50"><div className="space-y-1 text-center">{newBannerImage ? (<div className="relative group"><img src={newBannerImage} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" /><button onClick={() => setNewBannerImage(null)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button></div>) : (<><Upload className="mx-auto h-12 w-12 text-slate-400" /><div className="flex text-sm text-slate-600 justify-center"><label htmlFor="banner-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"><span>Upload file</span><input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={handleBannerUpload} /></label></div><p className="text-xs text-slate-500">1200x800 recommended</p></>)}</div></div></div><button onClick={submitBanner} disabled={!newBannerImage || bannerImages.length >= 10} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">Add Banner to Carousel</button></div>
               </div>
               <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                  <h2 className="text-xl font-bold mb-6 flex items-center"><div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3"><Settings className="w-5 h-5 text-gray-600" /></div>Carousel Settings</h2>
                  <div className="space-y-4"><label className="block text-sm font-semibold">Slide Interval (seconds)</label><div className="flex items-center gap-4"><input type="range" min="2" max="20" value={tempInterval} onChange={(e) => setTempInterval(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" /><span className="text-lg font-bold w-12 text-center">{tempInterval}s</span></div><p className="text-xs text-slate-500">Time between auto-sliding images.</p><button onClick={handleIntervalChange} className="w-full mt-4 flex justify-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 transition-all">Update Interval</button></div>
               </div>
             </div>
             <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" />Active Banners <span className="text-slate-500 font-normal">({bannerImages.length}/10)</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {bannerImages.map((img, index) => (<div key={index} className="group relative aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200"><img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={() => removeBannerImage(index)} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg"><Trash2 className="w-5 h-5" /></button></div><div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Slide {index + 1}</div></div>))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'cms' && (
          // ... (existing CMS code)
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Policy Editor */}
              <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8">
                {/* ... Policy Editor content ... */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                     <FileText className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  </div>
                  Site Content Editor
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Select Page to Edit</label>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <button 
                        onClick={() => setSelectedPolicy('privacyPolicy')} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPolicy === 'privacyPolicy' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-gray-300'}`}
                      >
                        Privacy Policy
                      </button>
                      <button 
                        onClick={() => setSelectedPolicy('termsConditions')} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPolicy === 'termsConditions' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-gray-300'}`}
                      >
                        Terms & Conditions
                      </button>
                      <button 
                        onClick={() => setSelectedPolicy('returnPolicy')} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPolicy === 'returnPolicy' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-gray-300'}`}
                      >
                        Return Policy
                      </button>
                      <button 
                        onClick={() => setSelectedPolicy('cookiePolicy')} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPolicy === 'cookiePolicy' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-gray-300'}`}
                      >
                        Cookie Policy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Content</label>
                    <textarea 
                      rows={12}
                      value={isEditingContent ? contentDraft : siteContent[selectedPolicy]}
                      onChange={(e) => {
                        setContentDraft(e.target.value);
                        setIsEditingContent(true);
                      }}
                      className="w-full rounded-xl border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-4 font-mono text-sm leading-relaxed"
                      placeholder="Enter page content here..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleSavePolicy}
                      disabled={!isEditingContent}
                      className="flex items-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Management */}
              <div className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                {/* ... FAQ content ... */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mr-3">
                     <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-500" />
                  </div>
                  FAQ Manager
                </h2>

                <div className="space-y-6">
                  {/* Add FAQ Form */}
                  <div className="space-y-3 bg-slate-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-slate-100 dark:border-neutral-800">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300">Add New Question</h3>
                    <input 
                      type="text" 
                      placeholder="Question" 
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      className="w-full text-sm rounded-lg border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2"
                    />
                    <textarea 
                      placeholder="Answer" 
                      rows={2}
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      className="w-full text-sm rounded-lg border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2"
                    />
                    <button 
                      onClick={handleAddFaq}
                      disabled={!newFaq.question || !newFaq.answer}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Add FAQ
                    </button>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {faqs.map(faq => (
                      <div key={faq.id} className="p-3 bg-white dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-neutral-700 group">
                        {editingFaqId === faq.id ? (
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              value={editFaqForm.question}
                              onChange={(e) => setEditFaqForm({...editFaqForm, question: e.target.value})}
                              className="w-full text-sm rounded-lg border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-900 p-2"
                            />
                            <textarea 
                              rows={2}
                              value={editFaqForm.answer}
                              onChange={(e) => setEditFaqForm({...editFaqForm, answer: e.target.value})}
                              className="w-full text-sm rounded-lg border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-900 p-2"
                            />
                            <div className="flex gap-2">
                              <button onClick={saveFaq} className="flex-1 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded hover:bg-green-200">Save</button>
                              <button onClick={() => setEditingFaqId(null)} className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded hover:bg-gray-200">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 pr-2">{faq.question}</h4>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditingFaq(faq)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteFaq(faq.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">{faq.answer}</p>
                          </>
                        )}
                      </div>
                    ))}
                    {faqs.length === 0 && <p className="text-center text-sm text-slate-400">No FAQs yet.</p>}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};