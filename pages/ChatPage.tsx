
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Message, User } from '../types';
import { getMessages, sendMessage, getThreadId } from '../services/mock/chat';
import { getUserById } from '../services/mock/users';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import SendIcon from '../components/icons/SendIcon';

const ChatPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      if (!user || !threadId) return;
      
      setIsLoading(true);
      try {
        // Extract other user ID from thread ID (assuming format id1-id2)
        // If the threadId was passed directly, we need to parse it.
        // If we came from a "Message" button on profile, we might have passed a userId or a threadId.
        // For simplicity, let's assume the threadId IS the identifier for the conversation.
        // We need to identify the "other" user.
        
        const ids = threadId.split('-');
        const otherUserId = ids.find(id => id !== user.id);
        
        if (otherUserId) {
            const userData = await getUserById(otherUserId);
            if (userData) setOtherUser(userData);
        }

        const msgs = await getMessages(threadId);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [user, threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !threadId) return;

    try {
      const msg = await sendMessage(threadId, user.id, newMessage);
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-dark-bg text-dark-text relative z-50">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800 bg-dark-surface shrink-0">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-400 hover:text-white">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        {otherUser ? (
          <div className="flex items-center">
            <img src={otherUser.avatarUrl} alt={otherUser.username} className="w-10 h-10 rounded-full border border-gray-700 mr-3" />
            <div>
              <h2 className="font-bold">{otherUser.username}</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        ) : (
          <div className="h-10 flex items-center"><span className="animate-pulse bg-gray-700 h-4 w-24 rounded"></span></div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg">
        {isLoading ? (
             <div className="flex justify-center pt-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
             </div>
        ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
                <p>No messages yet.</p>
                <p className="text-sm">Say hello! 👋</p>
            </div>
        ) : (
            messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isMe 
                            ? 'bg-brand-primary text-white rounded-tr-none' 
                            : 'bg-dark-surface text-gray-200 rounded-tl-none border border-gray-700'
                        }`}>
                            <p className="text-sm md:text-base">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                {msg.createdAt}
                            </p>
                        </div>
                    </div>
                );
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark-surface border-t border-gray-800 shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 text-white rounded-full py-3 px-5 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all border border-gray-800"
            />
            <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className={`p-3 rounded-full ${newMessage.trim() ? 'bg-brand-primary text-white' : 'bg-gray-800 text-gray-500'} transition-colors`}
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
