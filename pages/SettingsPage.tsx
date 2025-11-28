
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import ImageIcon from '../components/icons/ImageIcon';

const SettingsPage: React.FC = () => {
  const { user, logout, updateProfile } = useAppContext();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
        setUsername(user.username);
        setEmail(user.email);
        setAvatarPreview(user.avatarUrl);
        setBannerPreview(user.bannerUrl || null);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (type === 'avatar') setAvatarPreview(reader.result as string);
              else setBannerPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = async () => {
      setIsLoading(true);
      setSuccessMsg(null);
      try {
          await updateProfile({
              username,
              avatarUrl: avatarPreview || user?.avatarUrl,
              bannerUrl: bannerPreview || user?.bannerUrl
          });
          setSuccessMsg("Profile updated successfully!");
          setTimeout(() => {
              setSuccessMsg(null);
              setIsEditing(false);
          }, 2000);
      } catch (error) {
          console.error("Failed to update profile", error);
      } finally {
          setIsLoading(false);
      }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 text-dark-text max-w-2xl mx-auto w-full md:p-8 pb-20 md:pb-8">
      <h1 className="text-3xl font-bold text-center mb-8">{isEditing ? 'Edit Profile' : 'Account Settings'}</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">Profile</h2>
            {!isEditing && (
                <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-brand-primary text-sm font-semibold hover:underline"
                >
                    Edit
                </button>
            )}
          </div>
          
          <div className="bg-dark-surface rounded-lg overflow-hidden">
            {isEditing ? (
                <div className="p-6 space-y-6">
                     {/* Banner Edit */}
                    <div className="relative w-full h-32 rounded-lg bg-gray-800 border-2 border-dashed border-gray-600 overflow-hidden group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">Tap to upload banner</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white font-bold">Change Banner</span>
                        </div>
                        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
                    </div>

                    {/* Avatar Edit */}
                    <div className="flex flex-col items-center -mt-16 relative z-10">
                        <div className="relative w-24 h-24 rounded-full bg-gray-800 border-4 border-dark-surface overflow-hidden group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full"><ImageIcon className="w-8 h-8 text-gray-500" /></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                disabled
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-md p-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {successMsg && <p className="text-green-500 text-sm text-center">{successMsg}</p>}

                    <div className="flex space-x-3 pt-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 py-3 bg-brand-primary rounded-lg font-semibold text-white hover:bg-red-600 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center p-4">
                        <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                        <div className="ml-4">
                            <p className="font-bold text-dark-text">@{user.username}</p>
                            <p className="text-sm text-dark-text-secondary">{user.email}</p>
                        </div>
                    </div>
                    <Link to={`/profile/${user.id}`} className="flex justify-between items-center p-4 border-t border-gray-700 hover:bg-gray-800 transition-colors">
                        <span className="text-dark-text">View Public Profile</span>
                        <ChevronRightIcon className="w-5 h-5 text-dark-text-secondary" />
                    </Link>
                </>
            )}
          </div>
        </div>

        {/* Subscription Section */}
        {!isEditing && (
            <div>
            <h2 className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wider mb-2">Subscription</h2>
            <div className="bg-dark-surface rounded-lg">
                <div className="flex justify-between items-center p-4">
                    <span className="text-dark-text">Current Plan</span>
                    <span className="font-bold text-brand-secondary">{user.plan}</span>
                </div>
                <Link to="/plans" className="flex justify-between items-center p-4 border-t border-gray-700 hover:bg-gray-800 transition-colors">
                <span className="text-dark-text">Change Plan</span>
                <ChevronRightIcon className="w-5 h-5 text-dark-text-secondary" />
                </Link>
            </div>
            </div>
        )}

        {/* Logout Button */}
        {!isEditing && (
            <div>
            <button
                onClick={handleLogout}
                className="w-full text-center bg-dark-surface hover:bg-gray-800 text-brand-primary font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Log Out
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
