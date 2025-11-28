
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Item, Review } from '../types';
import { getUserById } from '../services/mock/users';
import { getItemsByUserId } from '../services/mock/items';
import { isFollowing, toggleFollow } from '../services/mock/follows';
import { getThreadId } from '../services/mock/chat';
import { getReviews, addReview } from '../services/mock/reviews';
import MessageIcon from '../components/icons/MessageIcon';
import ShareIcon from '../components/icons/ShareIcon';
import ShareModal from '../components/ShareModal';
import ItemDetailsModal from '../components/ItemDetailsModal';
import { useAppContext } from '../context/AppContext';

const ShopProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { setModalOpen, user: currentUser } = useAppContext();
  
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'items' | 'reviews'>('items');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Review Form State
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("User ID not found.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const [userData, userItems, userReviews] = await Promise.all([
          getUserById(userId),
          getItemsByUserId(userId),
          getReviews(userId)
        ]);
        
        if (userData) {
          setUser(userData);
          setItems(userItems);
          setReviews(userReviews);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Check follow status separately
  useEffect(() => {
    const checkFollowStatus = async () => {
        if (currentUser && userId && currentUser.id !== userId) {
            const status = await isFollowing(currentUser.id, userId);
            setIsFollowed(status);
        }
    };
    checkFollowStatus();
  }, [currentUser, userId]);

  const handleShareClick = () => {
    setShareModalOpen(true);
    setModalOpen(true);
  };

  const handleCloseShare = () => {
    setShareModalOpen(false);
    setModalOpen(false);
  };

  const handleFollowClick = async () => {
      if (!currentUser) {
          navigate('/login');
          return;
      }
      if (!userId) return;

      setIsFollowLoading(true);
      try {
          const newStatus = await toggleFollow(currentUser.id, userId);
          setIsFollowed(newStatus);
      } catch (error) {
          console.error("Failed to toggle follow", error);
      } finally {
          setIsFollowLoading(false);
      }
  };

  const handleMessageClick = () => {
      if (!currentUser) {
          navigate('/login');
          return;
      }
      if (!userId) return;
      
      const threadId = getThreadId(currentUser.id, userId);
      navigate(`/chat/${threadId}`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userId || !newReviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
        const review = await addReview(userId, currentUser, newReviewRating, newReviewText);
        setReviews([review, ...reviews]);
        setNewReviewText('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
    } catch (error) {
        console.error("Failed to add review", error);
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const handleItemClick = (item: Item) => {
      setSelectedItem(item);
      setModalOpen(true);
  };

  const handleCloseItemDetails = () => {
      setSelectedItem(null);
      setModalOpen(false);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 p-4 text-center">
        <p>{error || "User not found"}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-full bg-dark-bg text-dark-text pb-20 md:pb-0">
      {/* Navbar overlay */}
      <div className="absolute top-0 left-0 p-4 z-10 w-full flex justify-between md:hidden">
         <button onClick={() => navigate(-1)} className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
      </div>

      {/* Banner */}
      <div className="h-40 md:h-64 w-full relative">
        <img src={user.bannerUrl || "https://picsum.photos/600/200?blur"} alt="banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-dark-bg" />
      </div>

      {/* Profile Content */}
      <div className="px-4 md:px-8 -mt-12 relative max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
            <div className="flex items-end">
                <img 
                    src={user.avatarUrl} 
                    alt={user.username} 
                    className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-dark-bg bg-dark-surface shadow-xl object-cover" 
                />
            </div>
            
            {!isOwnProfile && (
                <div className="flex space-x-2 mt-4 md:mt-0 md:mb-4">
                    <button 
                        onClick={handleFollowClick}
                        disabled={isFollowLoading}
                        className={`font-semibold py-2 px-6 rounded-md transition shadow-lg flex-1 md:flex-none ${
                            isFollowed 
                            ? 'bg-dark-surface border border-gray-600 text-white hover:bg-gray-800' 
                            : 'bg-brand-primary text-white hover:bg-red-600 shadow-brand-primary/30'
                        }`}
                    >
                        {isFollowed ? 'Following' : 'Follow'}
                    </button>
                    <button 
                        onClick={handleMessageClick}
                        className="bg-dark-surface border border-gray-600 text-white p-2 rounded-md hover:bg-gray-800 transition"
                    >
                        <MessageIcon className="w-6 h-6" />
                    </button>
                    <button 
                    onClick={handleShareClick}
                    className="bg-dark-surface border border-gray-600 text-white p-2 rounded-md hover:bg-gray-800 transition"
                    >
                        <ShareIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
            
            {isOwnProfile && (
                 <div className="flex space-x-2 mt-4 md:mt-0 md:mb-4">
                    <button 
                        onClick={() => navigate('/settings')}
                        className="bg-dark-surface border border-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition shadow-lg flex-1 md:flex-none font-semibold"
                    >
                        Edit Profile
                    </button>
                 </div>
            )}
        </div>

        <div className="mb-6 md:mb-10">
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-bold">@{user.username}</h1>
                {user.plan === 'Premium' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            
             <div className="flex items-center text-sm md:text-base text-gray-400 mt-2 space-x-6">
                 <span><b className="text-white">{items.length}</b> Items</span>
                 <span><b className="text-white">{reviews.length > 0 ? getAverageRating() : 'New'}</b> ★ Rating ({reviews.length})</span>
            </div>
            
            <p className="text-sm md:text-base text-gray-300 mt-3 leading-relaxed max-w-2xl">
                Trusted seller of rare collectibles and vintage gear. Fast shipping worldwide 🌍. DM for offers!
            </p>
        </div>

        {/* Content Area */}
        <div className="mt-2 border-t border-gray-800">
            <div className="flex border-b border-gray-800">
                <button 
                    onClick={() => setActiveTab('items')}
                    className={`flex-1 text-center py-3 font-medium text-sm md:text-base cursor-pointer transition-colors ${activeTab === 'items' ? 'border-b-2 border-white text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Shop Items
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 text-center py-3 font-medium text-sm md:text-base cursor-pointer transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-white text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Reviews
                </button>
            </div>
            
            <div className="p-2 md:p-4 min-h-[300px]">
                {activeTab === 'items' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                        {items.length > 0 ? items.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="aspect-[3/4] bg-dark-surface rounded-md md:rounded-lg overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all duration-300"
                        >
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                                <p className="text-white text-xs md:text-sm font-semibold truncate">{item.title}</p>
                                <p className="text-brand-primary font-bold text-sm md:text-base">R {item.value}</p>
                            </div>
                        </div>
                        )) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No items found.
                            </div>
                        )}
                    </div>
                ) : (
                    // Reviews Tab
                    <div className="max-w-2xl mx-auto space-y-6">
                        {!isOwnProfile && currentUser && (
                            <div className="bg-dark-surface p-4 rounded-xl border border-gray-800">
                                <h3 className="font-bold mb-3">Leave a Review</h3>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="flex space-x-2 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star} 
                                                type="button"
                                                onClick={() => setNewReviewRating(star)}
                                                className={`text-2xl ${star <= newReviewRating ? 'text-yellow-400' : 'text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        value={newReviewText}
                                        onChange={(e) => setNewReviewText(e.target.value)}
                                        placeholder="Write your experience..."
                                        className="w-full bg-gray-900 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary mb-3 resize-none"
                                        rows={3}
                                    />
                                    <div className="flex justify-between items-center">
                                        {reviewSuccess && <span className="text-green-500 text-sm">Review added!</span>}
                                        <button 
                                            type="submit"
                                            disabled={!newReviewText.trim() || isSubmittingReview}
                                            className="bg-brand-primary text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-red-600 disabled:opacity-50 ml-auto"
                                        >
                                            {isSubmittingReview ? 'Posting...' : 'Post Review'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.map(review => (
                                <div key={review.id} className="bg-dark-surface p-4 rounded-xl border border-gray-800/50">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center">
                                            <img src={review.reviewer.avatarUrl} alt="reviewer" className="w-8 h-8 rounded-full mr-3 border border-gray-700" />
                                            <div>
                                                <p className="font-bold text-sm text-gray-200">{review.reviewer.username}</p>
                                                <div className="flex text-yellow-400 text-xs">
                                                    {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{review.createdAt}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.text}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-500">
                                    No reviews yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
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

export default ShopProfilePage;
