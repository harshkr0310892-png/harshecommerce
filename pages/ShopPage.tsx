import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Filter } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories } = useShop(); // Use dynamic products and categories
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Initialize price range with a higher default suitable for INR
  const [priceRange, setPriceRange] = useState<number>(50000);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const priceMatch = product.price <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategory, priceRange]);

  const displayCategories = ['All', ...categories];

  // Calculate dynamic max price for range slider, defaulting to 50000 if empty
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 50000;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 sticky top-24 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-semibold text-lg">
                <Filter className="w-5 h-5 text-indigo-600 dark:text-gold-500" />
                <h2>Filters</h2>
              </div>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4 uppercase tracking-wider">Categories</h3>
                <div className="space-y-3">
                  {displayCategories.map((cat) => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="peer w-4 h-4 text-indigo-600 dark:text-gold-500 border-gray-300 dark:border-neutral-600 focus:ring-indigo-500 dark:focus:ring-gold-500 cursor-pointer bg-gray-50 dark:bg-neutral-800"
                        />
                        <div className="peer-checked:scale-110 transition-transform"></div>
                      </div>
                      <span className={`ml-3 text-sm transition-colors ${selectedCategory === cat ? 'text-indigo-600 dark:text-gold-400 font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-4 uppercase tracking-wider">
                  Max Price: ₹{priceRange.toLocaleString('en-IN')}
                </h3>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-gold-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span>₹0</span>
                  <span>₹{maxPrice.toLocaleString('en-IN')}+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h1>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-slate-100 dark:border-neutral-800">
                {filteredProducts.length} results
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-slate-300 dark:border-neutral-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No products found matching your filters.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setPriceRange(maxPrice); }}
                  className="mt-2 text-indigo-600 dark:text-gold-500 hover:text-indigo-800 dark:hover:text-gold-400 font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};