import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { Trash2, Edit2, Plus, Save, X, LogOut, Package, Tag, Check, LayoutGrid, Upload, Image as ImageIcon, ClipboardList, Clock, MapPin, Mail, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    categories, 
    orders,
    addProduct, 
    deleteProduct, 
    updateProductPrice,
    addCategory,
    updateCategory,
    deleteCategory
  } = useShop();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  
  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  // State for product images
  const [newImages, setNewImages] = useState<string[]>([]);

  // State for category management
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // State for editing product price
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  // Initialize new product category with the first available category
  React.useEffect(() => {
    if (categories.length > 0 && !newProduct.category) {
      setNewProduct(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, newProduct.category]);

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
      category: newProduct.category,
      description: newProduct.description,
      image: newImages[0], // Main image is the first one
      images: newImages // All images
    });

    // Reset form
    setNewProduct({
      name: '',
      price: '',
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
    setEditPrice(product.price.toString());
  };

  const savePrice = (id: number) => {
    updateProductPrice(id, parseFloat(editPrice));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600 dark:text-gold-500" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-slate-500 dark:text-gray-400 text-sm">Manage your inventory and view orders</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 bg-slate-100 dark:bg-neutral-900 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
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
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
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
        </div>

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Product Section */}
              <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-gold-500/20 rounded-lg flex items-center justify-center mr-3">
                     <Plus className="w-5 h-5 text-indigo-600 dark:text-gold-500" />
                  </div>
                  Add New Product
                </h2>
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 space-y-2">
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

                  <div className="col-span-1 space-y-2">
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

                  <div className="col-span-1 space-y-2">
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

                  {/* Image Upload Section */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">
                      Product Images (Max 7)
                    </label>
                    
                    {/* Upload Area */}
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

                    {/* Image Previews */}
                    {newImages.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-4">
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

                  <div className="col-span-1 md:col-span-2 space-y-2">
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

                  <div className="col-span-1 md:col-span-2 pt-2">
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

              {/* Category Management Section */}
              <div className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 h-fit">
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
                      placeholder="New Category..." 
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

            {/* Product List */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Inventory <span className="text-slate-500 font-normal">({products.length} items)</span></h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-neutral-800">
                  <thead className="bg-slate-50 dark:bg-neutral-800/50">
                    <tr>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Price (₹)</th>
                      <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-slate-100 dark:divide-neutral-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-lg border border-slate-200 dark:border-neutral-700 overflow-hidden">
                              <img className="h-full w-full object-cover" src={product.image} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white max-w-xs truncate" title={product.name}>{product.name}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">ID: #{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-gold-500 border border-indigo-100 dark:border-neutral-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-gray-300 font-medium">
                          {editingId === product.id ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400">₹</span>
                              <input 
                                type="number" 
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-24 rounded-lg border-slate-300 dark:border-neutral-600 dark:bg-neutral-800 p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                          ) : (
                            `₹${product.price.toLocaleString('en-IN')}`
                          )}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === product.id ? (
                            <div className="flex justify-end space-x-2">
                               <button onClick={() => savePrice(product.id)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Save className="w-4 h-4" /></button>
                               <button onClick={cancelEdit} className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => startEditing(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg dark:text-gold-500 dark:hover:bg-neutral-800 transition-colors" title="Edit Price">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors" title="Delete Product">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                <p className="text-slate-500 dark:text-gray-400">Orders placed by customers will appear here.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Orders <span className="text-slate-500 font-normal">({orders.length})</span></h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        
                        {/* Order Info Header */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-indigo-600 dark:text-gold-500 font-mono">#{order.id}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2 text-slate-600 dark:text-gray-300">
                              <UserIcon className="w-4 h-4 mt-0.5 text-slate-400" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{order.customer.name}</p>
                                <p className="text-xs">{order.customer.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-slate-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                              <div>
                                <p>{order.customer.address}</p>
                                <p className="text-xs">{order.customer.city}, {order.customer.zipCode}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                               <Clock className="w-4 h-4" />
                               {formatDate(order.date)}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex-1 md:max-w-md bg-slate-50 dark:bg-neutral-800/50 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Items Purchased</h4>
                          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-full text-xs font-bold text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-neutral-600">
                                    {item.quantity}
                                  </span>
                                  <span className="text-slate-800 dark:text-gray-200 truncate max-w-[150px]">{item.name}</span>
                                </div>
                                <span className="text-slate-600 dark:text-gray-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-700 flex justify-between items-center">
                            <span className="font-bold text-slate-700 dark:text-gray-300">Total Amount</span>
                            <span className="font-bold text-lg text-slate-900 dark:text-white">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};