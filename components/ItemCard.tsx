
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import HeartIcon from './icons/HeartIcon';
import MessageIcon from './icons/MessageIcon';
import ShareIcon from './icons/ShareIcon';
import ItemDetailsModal from './ItemDetailsModal';
import CommentsModal from './CommentsModal';
import ShareModal from './ShareModal';
import { useAppContext } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  onLike: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onLike }) => {
  const { setModalOpen } = useAppContext();
  // State to track which modal is open: 'none', 'details', 'comments', or 'share'
  const [activeModal, setActiveModal] = useState<'none' | 'details' | 'comments' | 'share'>('none');
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [commentCount, setCommentCount] = useState(item.comments);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(item.id);
    if (!item.isLiked) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
  };

  const handleCardClick = () => {
    setModalOpen(true);
    setActiveModal('details');
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
    setActiveModal('comments');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
    setActiveModal('share');
  };

  const handleCloseModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalOpen(false);
    setActiveModal('none');
  };

  const handleCommentAdded = () => {
      setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <div 
        className="relative h-[calc(100vh-4rem)] md:h-screen snap-start text-white flex flex-col justify-end bg-dark-surface overflow-hidden group cursor-pointer" 
        onClick={handleCardClick}
      >
        {/* Main Image */}
        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 md:group-hover:scale-105" />
        
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-50% to-black/80 pointer-events-none z-0"></div>

        {/* Double Click Like Animation */}
        {showLikeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <HeartIcon className="w-32 h-32 text-red-500/90 drop-shadow-lg animate-like-burst" filled />
            </div>
        )}

        <div className="p-4 z-10 flex justify-between items-end w-full pb-6 md:pb-12">
          {/* Left Side: Info */}
          <div className="flex-1 pr-12">
            <Link to={`/profile/${item.user.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center mb-3 group/user">
              <div className="relative">
                 <img src={item.user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white group-hover/user:scale-105 transition-transform" alt={item.user.username} />
                 <div className="absolute -bottom-1 -right-1 bg-brand-primary rounded-full p-0.5 border border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
              <span className="font-bold text-lg drop-shadow-md ml-3 group-hover/user:underline">@{item.user.username}</span>
            </Link>
            
            <h4 className="font-semibold text-xl mb-1 drop-shadow-md leading-tight">{item.title}</h4>
            <p className="text-sm text-gray-200 mb-3 drop-shadow-md line-clamp-2 md:line-clamp-3">{item.description}</p>
            
            <div className="flex items-center space-x-2">
                 <div className="text-md font-bold bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-green-400">
                    R {item.value.toLocaleString()}
                </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex flex-col space-y-6 items-center absolute right-2 bottom-20 md:bottom-28">
            <div className="flex flex-col items-center group/action">
                <button 
                    onClick={handleLikeClick} 
                    className="p-3 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90 group-hover/action:bg-black/40"
                >
                    <HeartIcon filled={!!item.isLiked} className={`w-8 h-8 ${item.isLiked ? 'text-brand-primary' : 'text-white'}`} />
                </button>
                <span className="text-xs font-semibold drop-shadow-md mt-1">{item.likes.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-center group/action">
                <button 
                    onClick={handleCommentsClick} 
                    className="p-3 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90 group-hover/action:bg-black/40"
                >
                    <MessageIcon className="w-8 h-8 text-white" />
                </button>
                <span className="text-xs font-semibold drop-shadow-md mt-1">{commentCount.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-center group/action">
                <button 
                  onClick={handleShareClick}
                  className="p-3 rounded-full bg-black/20 backdrop-blur-sm transition-transform active:scale-90 group-hover/action:bg-black/40"
                >
                    <ShareIcon className="w-8 h-8 text-white" />
                </button>
                <span className="text-xs font-semibold drop-shadow-md mt-1">Share</span>
            </div>
          </div>
        </div>
      </div>
      
      {activeModal === 'details' && (
        <ItemDetailsModal item={item} onClose={handleCloseModal} />
      )}
      
      {activeModal === 'comments' && (
        <CommentsModal 
            item={item} 
            onClose={handleCloseModal} 
            onCommentAdded={handleCommentAdded}
        />
      )}

      {activeModal === 'share' && (
        <ShareModal 
            item={item} 
            onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default ItemCard;
