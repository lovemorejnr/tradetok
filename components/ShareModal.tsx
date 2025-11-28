
import React, { useState } from 'react';
import { Item, User } from '../types';
import CloseIcon from './icons/CloseIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import FacebookIcon from './icons/FacebookIcon';
import EmailIcon from './icons/EmailIcon';
import LinkIcon from './icons/LinkIcon';
import ShareIcon from './icons/ShareIcon';

interface ShareModalProps {
  item?: Item;
  user?: User;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, user, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Determine what we are sharing
  const targetUser = item ? item.user : user;
  
  // Construct a shareable URL. 
  // If sharing an item, we ideally link to item details, but for now linking to profile is the fallback.
  // If sharing a user, we link to their profile.
  const shareUrl = targetUser 
    ? `${window.location.origin}/#/profile/${targetUser.id}`
    : window.location.origin;

  const shareText = item 
    ? `Check out this ${item.title} by @${item.user.username} on TradeTok! Value: R ${item.value}`
    : (targetUser ? `Check out @${targetUser.username}'s shop on TradeTok! 🛍️` : 'Check out TradeTok!');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item ? item.title : (targetUser ? `${targetUser.username}'s Shop` : 'TradeTok'),
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-8 h-8 text-white" />,
      color: 'bg-[#25D366]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="w-8 h-8 text-white" />,
      color: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Email',
      icon: <EmailIcon className="w-8 h-8 text-white" />,
      color: 'bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(item ? `Check out ${item.title}` : `Check out @${targetUser?.username}`)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
    },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
       <div 
        className="bg-dark-surface w-full md:w-[400px] md:rounded-2xl rounded-t-2xl p-6 relative transform transition-transform animate-slide-up shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
            @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .animate-slide-up { animation: slide-up 0.3s ease-out; }
        `}</style>

        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Share {item ? 'Item' : 'Profile'}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                <CloseIcon className="w-6 h-6 text-gray-400" />
            </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
            {shareLinks.map((link) => (
                <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2 group"
                >
                    <div className={`${link.color} p-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110`}>
                        {link.icon}
                    </div>
                    <span className="text-xs text-gray-300">{link.name}</span>
                </a>
            ))}
             <button 
                onClick={handleCopyLink}
                className="flex flex-col items-center space-y-2 group"
            >
                <div className="bg-gray-700 p-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                    <LinkIcon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-gray-300">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>

        {/* Native Share / Other Apps */}
        {navigator.share && (
            <div className="border-t border-gray-800 pt-4">
                 <button 
                    onClick={handleNativeShare}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span>More Options...</span>
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ShareModal;
