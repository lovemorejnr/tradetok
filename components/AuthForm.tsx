
import React, { useState, useRef } from 'react';
import { AuthCredentials } from '../services/mock/auth';
import ImageIcon from './icons/ImageIcon';

interface AuthFormProps {
    formType: 'login' | 'signup';
    onSubmit: (credentials: AuthCredentials) => void;
    loading: boolean;
    error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ formType, onSubmit, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<string | null>(null);
    const [formError, setFormError] = useState('');

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const isLogin = formType === 'login';
    const title = isLogin ? 'Log In' : 'Create Account';
    const buttonText = isLogin ? 'Log In' : 'Sign Up';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') setAvatarFile(reader.result as string);
                else setBannerFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!email) {
            setFormError('Email is required.');
            return;
        }
        if (!password) {
            setFormError('Password is required.');
            return;
        }
        if (!isLogin && !username) {
            setFormError('Username is required.');
            return;
        }
        
        onSubmit({ 
            email, 
            password, 
            username,
            avatarBase64: avatarFile,
            bannerBase64: bannerFile
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {!isLogin && (
                <div className="space-y-4 mb-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <label className="block text-sm font-medium text-dark-text-secondary mb-2">Profile Picture</label>
                        <div 
                            onClick={() => avatarInputRef.current?.click()}
                            className="w-24 h-24 rounded-full bg-dark-surface border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden relative group"
                        >
                            {avatarFile ? (
                                <>
                                    <img src={avatarFile} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                </>
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-500" />
                            )}
                        </div>
                        <input 
                            ref={avatarInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, 'avatar')}
                        />
                    </div>

                    {/* Banner Upload */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-dark-text-secondary mb-2">Shop Banner (Optional)</label>
                        <div 
                            onClick={() => bannerInputRef.current?.click()}
                            className="w-full h-24 rounded-lg bg-dark-surface border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden relative group"
                        >
                            {bannerFile ? (
                                <>
                                    <img src={bannerFile} alt="Banner Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <p className="text-white font-bold text-xs">Change Banner</p>
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-500 text-sm">Tap to upload banner</span>
                            )}
                        </div>
                        <input 
                            ref={bannerInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, 'banner')}
                        />
                    </div>
                </div>
            )}

            {!isLogin && (
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-dark-text-secondary">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-dark-surface border border-gray-700 rounded-md text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        placeholder="your_shop_name"
                    />
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-dark-surface border border-gray-700 rounded-md text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-dark-surface border border-gray-700 rounded-md text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    placeholder="••••••••"
                />
            </div>
            
            {(error || formError) && <p className="text-sm text-red-500">{error || formError}</p>}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary disabled:opacity-50 transition-colors"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        buttonText
                    )}
                </button>
            </div>
        </form>
    );
};

export default AuthForm;
