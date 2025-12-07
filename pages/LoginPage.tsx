import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Key, Shield, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where they came from or default to admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4 transition-all duration-500 relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:hidden"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:hidden"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:hidden"></div>

      <div className="max-w-md w-full space-y-8 bg-white/70 dark:bg-neutral-900/80 p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 dark:shadow-black/50 border border-white/50 dark:border-neutral-800 backdrop-blur-xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-gold-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 font-medium">
            Please enter your credentials to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/30 flex items-center animate-pulse">
               <div className="flex-shrink-0">
                 <Lock className="h-5 w-5 text-red-400" />
               </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  {error}
                </h3>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="relative group">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400 dark:text-gray-500 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-neutral-700 rounded-xl leading-5 bg-slate-50/50 dark:bg-neutral-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div className="relative group">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-indigo-400 dark:text-gray-500 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-neutral-700 rounded-xl leading-5 bg-slate-50/50 dark:bg-neutral-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 dark:bg-gold-500 hover:bg-indigo-700 dark:hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-gold-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 dark:shadow-gold-500/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              Sign in
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};