import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { updateUserProfile } = useShop();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate Authentication / Registration
    if (isLogin) {
      // Mock Login: Just Create profile from email
      // In a real app, this would verify credentials
      const nameFromEmail = formData.email.split('@')[0];
      // Capitalize first letter
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      updateUserProfile({
        name: displayName,
        email: formData.email,
        address: '',
        city: '',
        zipCode: ''
      });
    } else {
      // Registration
      updateUserProfile({
        name: formData.name,
        email: formData.email,
        address: '',
        city: '',
        zipCode: ''
      });
    }
    
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-slate-100 dark:border-neutral-800 overflow-hidden">
        
        {/* Header Toggle */}
        <div className="flex border-b border-slate-100 dark:border-neutral-800">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              isLogin 
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-gold-500 border-b-2 border-indigo-600 dark:border-gold-500' 
                : 'bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              !isLogin 
                ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-gold-500 border-b-2 border-indigo-600 dark:border-gold-500' 
                : 'bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLogin ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400'}`}>
              {isLogin ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Join NexStore'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              {isLogin ? 'Enter your details to access your account' : 'Start your AI-powered shopping journey today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-neutral-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-4 rounded-xl bg-indigo-600 dark:bg-gold-500 text-white font-bold text-lg hover:bg-indigo-700 dark:hover:bg-gold-600 transition-all shadow-lg shadow-indigo-500/20 dark:shadow-gold-500/20 mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};