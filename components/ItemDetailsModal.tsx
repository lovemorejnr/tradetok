
import React, { useState } from 'react';
import { Item } from '../types';
import CloseIcon from './icons/CloseIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { useAppContext } from '../context/AppContext';
import { makeOffer } from '../services/mock/offers';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ItemDetailsModalProps {
  item: Item;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'details' | 'offer'>('details');
  const [offerAmount, setOfferAmount] = useState<string>(item.value.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = item.images && item.images.length > 0 ? item.images : [item.imageUrl];

  const handleMakeOfferClick = () => {
    if (!user) {
        navigate('/login');
        return;
    }
    setView('offer');
  };

  const handleBackClick = () => {
    setView('details');
    setSuccessMsg(null);
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    try {
        await makeOffer(item, user, amount);
        setSuccessMsg("Offer sent successfully!");
        setTimeout(() => {
            onClose();
        }, 2000);
    } catch (error) {
        console.error("Failed to send offer", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <style>{`
          @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
          }
          .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <div 
        className="bg-dark-surface rounded-t-2xl md:rounded-2xl w-full max-w-md p-5 text-dark-text relative transform transition-transform animate-slide-up shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
            {view === 'offer' ? (
                <button onClick={handleBackClick} className="text-gray-400 hover:text-white transition-colors p-1">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            ) : (
                <div className="w-8"></div> // Spacer
            )}
            
            <h3 className="font-bold text-lg">{view === 'details' ? 'Item Details' : 'Make an Offer'}</h3>
            
            <button onClick={onClose} className="text-dark-text-secondary hover:text-dark-text p-1">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="overflow-y-auto no-scrollbar flex-1 py-2">
            {view === 'details' ? (
                <>
                    {/* Image Carousel */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-black">
                        <img 
                            src={images[currentImageIndex]} 
                            alt={`${item.title} - ${currentImageIndex + 1}`} 
                            className="w-full h-full object-contain" 
                        />
                        
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center mb-4 p-3 bg-gray-900 rounded-lg">
                        <img src={item.user.avatarUrl} className="w-12 h-12 rounded-full mr-4 border-2 border-brand-primary" alt={item.user.username} />
                        <div>
                            <h3 className="font-bold text-lg">@{item.user.username}</h3>
                            <p className="text-xs text-brand-secondary font-semibold uppercase tracking-wider">Verified Seller</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 leading-tight">{item.title}</h2>
                    
                    <div className="text-2xl font-bold text-brand-primary my-2">
                        R {item.value.toLocaleString()}
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 my-4">
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex space-x-3 mt-6 mb-2">
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleMakeOfferClick}
                            className="flex-1 bg-brand-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-transform active:scale-95 shadow-lg shadow-brand-primary/25"
                        >
                            Make an Offer
                        </button>
                    </div>
                </>
            ) : (
                // Offer View
                <form onSubmit={handleSubmitOffer} className="flex flex-col h-full justify-between min-h-[400px]">
                    <div>
                        <div className="flex items-center p-4 bg-black/40 border border-gray-800 rounded-2xl mb-8">
                            <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover mr-4" alt={item.title} />
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-lg truncate text-gray-100">{item.title}</h3>
                                <p className="text-gray-400 text-sm">Asking Price: <span className="text-white font-bold">R {item.value.toLocaleString()}</span></p>
                            </div>
                        </div>

                        {successMsg ? (
                            <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
                                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Offer Sent!</h3>
                                <p className="text-gray-400 text-center">The seller has been notified.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Your Offer</label>
                                <div className="relative w-full max-w-[220px] mb-2 flex justify-center">
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-500">R</span>
                                    <input 
                                        type="number" 
                                        value={offerAmount}
                                        onChange={(e) => setOfferAmount(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-gray-700 py-2 pl-6 pr-2 text-5xl font-bold text-white text-center focus:outline-none focus:border-brand-primary transition-colors placeholder-gray-700"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-8 text-center max-w-xs leading-relaxed">
                                    Offers are binding for 24 hours. The seller can accept, decline, or counter.
                                </p>
                            </div>
                        )}
                    </div>

                    {!successMsg && (
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-brand-primary/25 text-lg mt-6"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                `Send Offer`
                            )}
                        </button>
                    )}
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
