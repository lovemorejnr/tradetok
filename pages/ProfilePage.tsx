
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Item } from '../types';
import { getItemsByUserId } from '../services/mock/items';
import SettingsPage from './SettingsPage';
import ShareModal from '../components/ShareModal';
import ItemDetailsModal from '../components/ItemDetailsModal'; // Import modal
import { useAppContext as useGlobalContext } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { user } = useAppContext();
  const { setModalOpen } = useGlobalContext(); 
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'items' | 'likes'>('items');
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // State for selected item

  useEffect(() => {
    if (user) {
        getItemsByUserId(user.id).then(setItems);
    }
  }, [user]);

  const handleShareClick = () => {
    setShareModalOpen(true);
    setModalOpen(true);
  };

  const handleCloseShare = () => {
    setShareModalOpen(false);
    setModalOpen(false);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseItemDetails = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-dark-bg text-dark-text pb-20 md:pb-0">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800 sticky top-0 bg-dark-bg/95 backdrop-blur z-20 md:px-8">
        <h1 className="font-bold text-lg md:text-xl">{user.username}</h1>
        <Link to="/settings" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </Link>
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8 mb-6">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <img src={user.avatarUrl} alt={user.username} className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-brand-primary p-1 object-cover" />
            <div className="flex-1 md:hidden flex justify-around text-center">
               <div>
                   <div className="font-bold text-lg">{items.length}</div>
                   <div className="text-xs text-dark-text-secondary">Items</div>
               </div>
               <div>
                   <div className="font-bold text-lg">1.2k</div>
                   <div className="text-xs text-dark-text-secondary">Followers</div>
               </div>
               <div>
                   <div className="font-bold text-lg">340</div>
                   <div className="text-xs text-dark-text-secondary">Following</div>
               </div>
            </div>
          </div>

          <div className="flex-1">
             <div className="mb-4">
                <h2 className="font-bold text-2xl hidden md:block mb-2">@{user.username}</h2>
                <h2 className="font-bold text-lg md:hidden">@{user.username}</h2>
                <p className="text-sm md:text-base text-gray-300 mt-1 max-w-md">
                    Curator of fine things. 🕰️ Vintage lover. 
                    {user.plan && <span className="ml-2 text-[10px] bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/50 px-1.5 py-0.5 rounded uppercase tracking-wider align-middle">{user.plan} Seller</span>}
                </p>
            </div>

            <div className="hidden md:flex space-x-8 mb-4">
               <div><span className="font-bold text-lg">{items.length}</span> Items</div>
               <div><span className="font-bold text-lg">1.2k</span> Followers</div>
               <div><span className="font-bold text-lg">340</span> Following</div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 md:max-w-xs">
                <Link to="/settings" className="flex-1 bg-dark-surface border border-gray-700 rounded-md py-2 text-sm font-semibold text-center hover:bg-gray-800 transition">
                    Edit Profile
                </Link>
                <button 
                  onClick={handleShareClick}
                  className="px-3 bg-dark-surface border border-gray-700 rounded-md hover:bg-gray-800 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-800 mb-2">
            <button 
                onClick={() => setActiveTab('items')}
                className={`flex-1 py-3 flex justify-center items-center transition-all ${activeTab === 'items' ? 'border-b-2 border-white text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden md:inline">Items</span>
            </button>
            <button 
                onClick={() => setActiveTab('likes')}
                className={`flex-1 py-3 flex justify-center items-center transition-all ${activeTab === 'likes' ? 'border-b-2 border-white text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill={activeTab === 'likes' ? "white" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden md:inline">Liked</span>
            </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-4">
            {activeTab === 'items' ? (
                items.length > 0 ? (
                    items.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="aspect-square bg-gray-900 relative group overflow-hidden md:rounded-lg cursor-pointer"
                        >
                             <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <div className="flex items-center text-white font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="white" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {item.likes}
                                 </div>
                             </div>
                             <div className="absolute bottom-1 left-1 flex items-center text-white drop-shadow-md md:hidden">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="white" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                 <span className="text-xs font-bold">{item.likes}</span>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 md:col-span-5 text-center py-10 text-gray-500">No items posted yet</div>
                )
            ) : (
                 <div className="col-span-3 md:col-span-5 text-center py-20 bg-dark-surface rounded-lg">
                     <div className="text-gray-500 mb-2">🔒</div>
                     <p className="text-gray-400">Liked items are private</p>
                 </div>
            )}
        </div>
      </div>
      
      {isShareModalOpen && user && (
        <ShareModal user={user} onClose={handleCloseShare} />
      )}

      {selectedItem && (
        <ItemDetailsModal item={selectedItem} onClose={handleCloseItemDetails} />
      )}
    </div>
  );
};

export default ProfilePage;
