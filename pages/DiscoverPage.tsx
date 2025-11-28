
import React, { useState, useEffect } from 'react';
import SearchIcon from '../components/icons/SearchIcon';
import { Item } from '../types';
import { getItems } from '../services/mock/items';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Trending', 'Watches', 'Sneakers', 'Retro Games', 'Art', 'Coins', 'Furniture'];

const DiscoverPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching trending items
    const fetchTrending = async () => {
      setLoading(true);
      const { items: data } = await getItems(1, 10, 'anon');
      // Shuffle for "discovery" feel
      setItems(data.sort(() => Math.random() - 0.5));
      setLoading(false);
    };
    fetchTrending();
  }, [activeCategory]);

  return (
    <div className="min-h-full bg-dark-bg text-dark-text pb-20 md:pb-0">
      {/* Header & Search */}
      <div className="sticky top-0 z-20 bg-dark-bg/95 backdrop-blur-sm p-4 border-b border-gray-800 md:px-8 md:py-6">
        <h1 className="text-2xl font-bold mb-4 md:text-3xl">Discover</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-full leading-5 bg-dark-surface text-dark-text placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm transition-colors"
            placeholder="Search items, accounts, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto px-4 py-3 space-x-3 no-scrollbar scroll-smooth md:px-8 md:space-x-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === cat
                ? 'bg-brand-primary border-brand-primary text-white'
                : 'bg-dark-surface border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="p-2 md:p-8">
        {loading ? (
           <div className="flex items-center justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {items.map((item, index) => (
              <Link to={`/profile/${item.user.id}`} key={item.id} className="relative aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden group bg-dark-surface">
                 <img 
                   src={item.imageUrl} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-bold truncate">{item.title}</p>
                    <p className="text-brand-primary text-xs font-bold">R {item.value}</p>
                 </div>
                 {/* Live/Hot badge */}
                 {index % 3 === 0 && (
                   <div className="absolute top-2 left-2 bg-brand-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                     Trending
                   </div>
                 )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
