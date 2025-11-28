
import React, { useState, useEffect, useRef } from 'react';
import { Item, Comment } from '../types';
import { getComments, addComment } from '../services/mock/comments';
import { useAppContext } from '../context/AppContext';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import { Link } from 'react-router-dom';

interface CommentsModalProps {
  item: Item;
  onClose: () => void;
  onCommentAdded: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ item, onClose, onCommentAdded }) => {
  const { user } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(item.id);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [item.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const comment = await addComment(item.id, user, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      onCommentAdded();
      // Scroll to top of list (first item)
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-dark-surface w-full h-[70vh] md:h-[600px] md:w-[480px] md:rounded-2xl rounded-t-2xl flex flex-col relative transform transition-transform animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
            @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-slide-up { animation: slide-up 0.3s ease-out; }
            .animate-fade-in { animation: fade-in 0.2s ease-out; }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="w-8"></div> {/* Spacer */}
          <h2 className="font-bold text-sm md:text-base">
            {comments.length} comments
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
            <CloseIcon className="w-6 h-6 text-dark-text-secondary" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {loading ? (
             <div className="flex justify-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
             </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 group">
                <Link to={`/profile/${comment.user.id}`} onClick={onClose}>
                  <img 
                    src={comment.user.avatarUrl} 
                    alt={comment.user.username} 
                    className="w-10 h-10 rounded-full border border-gray-800 object-cover" 
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <Link to={`/profile/${comment.user.id}`} onClick={onClose} className="font-semibold text-sm hover:underline text-gray-200">
                      @{comment.user.username}
                    </Link>
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5 break-words">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <span className="text-4xl">💬</span>
              <p>No comments yet. Be the first!</p>
            </div>
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-dark-surface md:rounded-b-2xl">
          {user ? (
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full border border-gray-700" />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-900 text-white rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all placeholder-gray-500"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || submitting}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${newComment.trim() ? 'text-brand-primary hover:bg-brand-primary/10' : 'text-gray-600'}`}
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-2">
              <Link to="/login" className="text-brand-primary font-semibold hover:underline">Log in</Link> to post a comment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
