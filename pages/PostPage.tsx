
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { createItem } from '../services/mock/items';
import ImageIcon from '../components/icons/ImageIcon';
import CloseIcon from '../components/icons/CloseIcon';
import { getUploadCount, getPlanLimit, incrementUploadCount } from '../services/mock/uploads';

const PostPage: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadInfo, setUploadInfo] = useState<{ count: number; limit: number | null }>({ count: 0, limit: null });
  const [checkingLimit, setCheckingLimit] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUploadLimit = async () => {
      if (user && user.plan) {
        const count = await getUploadCount(user.id);
        const limit = getPlanLimit(user.plan);
        setUploadInfo({ count, limit });
      }
      setCheckingLimit(false);
    };
    checkUploadLimit();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 4 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (filesToProcess.length === 0) return;

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (images.length === 0) return "Please select at least one image.";
    if (!title.trim()) return "Please enter a title.";
    if (!description.trim()) return "Please enter a description.";
    if (!value || isNaN(Number(value)) || Number(value) <= 0) return "Please enter a valid estimated value.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        title,
        description,
        value: Number(value),
        user,
        imageUrls: images.map(img => img.preview), // In a real app, this would be URLs returned from cloud storage
      });
      await incrementUploadCount(user.id);
      setSuccess("Item posted successfully!");
      setTimeout(() => navigate('/home'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to post item.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (checkingLimit) {
      return (
          <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
      );
  }

  if (uploadInfo.limit !== null && uploadInfo.count >= uploadInfo.limit) {
      return (
          <div className="p-8 text-dark-text max-w-md mx-auto text-center flex flex-col justify-center h-full">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-4xl">🛑</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">Limit Reached</h1>
              <p className="text-gray-400 mb-6">
                  You've hit your monthly limit of {uploadInfo.limit} items. Unlock unlimited potential with Premium.
              </p>
              <Link
                  to="/plans"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-brand-primary to-pink-600 hover:from-red-600 hover:to-pink-700 transform transition hover:scale-105"
              >
                  Upgrade Now
              </Link>
          </div>
      );
  }


  return (
    <div className="flex flex-col h-full bg-dark-bg text-dark-text pb-20 md:pb-0">
      <div className="p-4 border-b border-gray-800 bg-dark-bg sticky top-0 z-10 text-center">
          <h1 className="text-xl font-bold">New Post</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto md:flex md:items-start md:space-x-8 md:p-8">
        {/* Image Upload Area */}
        <div className="md:w-1/2">
            <div 
                className={`relative w-full aspect-square bg-dark-surface overflow-hidden md:rounded-2xl border-2 border-dashed border-gray-700 ${images.length < 4 ? 'cursor-pointer hover:border-brand-primary' : ''} transition-colors mb-4`}
                onClick={() => images.length < 4 && fileInputRef.current?.click()}
            >
                {images.length > 0 ? (
                   <div className="grid grid-cols-2 gap-1 w-full h-full">
                        {images.map((img, index) => (
                             <div key={index} className="relative w-full h-full group">
                                 <img src={img.preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                 <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <CloseIcon className="w-4 h-4" />
                                 </button>
                             </div>
                        ))}
                        {images.length < 4 && (
                            <div className="flex flex-col items-center justify-center bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">Add</span>
                            </div>
                        )}
                   </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 group">
                        <div className="p-4 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                            <ImageIcon className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-medium">Tap to upload photos</p>
                        <p className="text-xs text-gray-500">(Max 4 images)</p>
                    </div>
                )}
                 <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    disabled={images.length >= 4}
                />
            </div>
            <p className="text-xs text-center text-gray-500 mb-4 md:mb-0">
                {images.length} / 4 images selected
            </p>
        </div>

        <div className="p-6 space-y-6 md:flex-1 md:p-0">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full bg-transparent border-b border-gray-700 py-2 text-lg font-medium text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="What are you selling?"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price / Value (R)</label>
                 <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="block w-full bg-transparent border-b border-gray-700 py-2 text-lg font-medium text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="0.00"
                    min="0"
                />
            </div>

            <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                 <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full bg-dark-surface rounded-lg border border-gray-800 p-3 mt-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                    placeholder="Describe condition, history, and details..."
                />
            </div>
            
            {error && <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">{error}</p>}
            {success && <p className="text-sm text-green-400 text-center bg-green-500/10 p-2 rounded">{success}</p>}

             <button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full py-4 px-4 rounded-full shadow-lg text-lg font-bold text-white bg-brand-primary hover:bg-red-600 disabled:opacity-50 transition-all active:scale-95"
            >
                {isLoading ? 'Posting...' : 'Post Item'}
            </button>
            
            <p className="text-center text-xs text-gray-500">
                Limit: {uploadInfo.count} / {uploadInfo.limit === Infinity ? '∞' : uploadInfo.limit} used this month.
            </p>
        </div>
      </form>
    </div>
  );
};

export default PostPage;
