
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { InboxThread, Notification } from '../types';
import { getInboxThreads, getNotifications } from '../services/mock/inbox';
import { getThreadId } from '../services/mock/chat';
import { Link, useNavigate } from 'react-router-dom';

const TABS = ['Messages', 'Notifications'];

const InboxPage: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Messages');
  
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [threadsData, notifsData] = await Promise.all([
            getInboxThreads(user.id),
            getNotifications(user.id)
        ]);
        setThreads(threadsData);
        setNotifications(notifsData);
      } catch (error) {
        console.error("Failed to load inbox", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleThreadClick = (otherUserId: string) => {
      if(!user) return;
      const threadId = getThreadId(user.id, otherUserId);
      navigate(`/chat/${threadId}`);
  };

  if (!user) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Sign in to view messages</h2>
              <p className="text-gray-400">Join the conversation and start trading.</p>
              <Link to="/login" className="bg-brand-primary text-white py-2 px-6 rounded-full font-bold">Log In</Link>
          </div>
      );
  }

  return (
    <div className="min-h-full bg-dark-bg text-dark-text pb-20 md:pb-0">
      <div className="sticky top-0 z-10 bg-dark-bg border-b border-gray-800 pt-4 px-4 md:pt-8 md:px-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Inbox</h1>
        <div className="flex w-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-dark-text text-dark-text'
                  : 'border-transparent text-dark-text-secondary hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-0 max-w-2xl mx-auto w-full min-h-[50vh]">
        {isLoading ? (
            <div className="flex justify-center pt-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
            </div>
        ) : activeTab === 'Messages' ? (
          <div className="flex flex-col">
            {threads.length > 0 ? (
                threads.map((thread) => (
                <div 
                    key={thread.id} 
                    onClick={() => handleThreadClick(thread.otherUser.id)}
                    className="flex items-center p-4 hover:bg-dark-surface active:bg-gray-800 transition-colors cursor-pointer border-b border-gray-800/50"
                >
                    <div className="relative">
                    <img src={thread.otherUser.avatarUrl} alt={thread.otherUser.username} className="w-14 h-14 rounded-full object-cover border border-gray-800" />
                    {thread.unreadCount > 0 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-primary rounded-full border-2 border-dark-bg"></div>}
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                        <h3 className={`font-semibold text-lg ${thread.unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>{thread.otherUser.username}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{thread.updatedAt}</span>
                    </div>
                    <p className={`text-sm truncate pr-4 mt-0.5 ${thread.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                        {thread.lastMessage}
                    </p>
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-20 text-gray-500">
                    No messages yet.
                </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                <div key={notif.id} className={`flex items-start p-4 hover:bg-dark-surface transition-colors border-b border-gray-800/50 ${!notif.isRead ? 'bg-white/5' : ''}`}>
                    <div className="mr-4 mt-1">
                        {notif.relatedUser ? (
                            <img src={notif.relatedUser.avatarUrl} alt="User" className="w-10 h-10 rounded-full border border-gray-700" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg">T</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-200">
                            {notif.relatedUser && <span className="font-bold mr-1">{notif.relatedUser.username}</span>}
                            {notif.text}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">{notif.createdAt}</span>
                    </div>
                    
                    {/* Notification Actions / Thumbnails */}
                    {notif.type === 'like' && notif.relatedItem && (
                        <div className="w-10 h-12 bg-gray-700 rounded ml-2 overflow-hidden border border-gray-700">
                            <img src={notif.relatedItem.imageUrl} className="w-full h-full object-cover" alt="item" />
                        </div>
                    )}
                    
                    {notif.type === 'offer' && notif.relatedItem && (
                        <div className="ml-2 flex flex-col items-end space-y-1">
                             <div className="w-10 h-10 rounded overflow-hidden border border-gray-700">
                                <img src={notif.relatedItem.imageUrl} className="w-full h-full object-cover" alt="item" />
                             </div>
                             <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">Offer</span>
                        </div>
                    )}

                    {notif.type === 'follow' && (
                        <button className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-md self-center ml-2 hover:bg-red-600 transition">Follow Back</button>
                    )}
                </div>
                ))
            ) : (
                <div className="text-center py-20 text-gray-500">
                    No notifications yet.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
