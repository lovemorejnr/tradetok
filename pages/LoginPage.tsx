
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AuthForm from '../components/AuthForm';
import { AuthCredentials } from '../services/mock/auth';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = async (credentials: AuthCredentials) => {
        setError(null);
        setIsLoading(true);
        try {
            await login(credentials);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Failed to log in.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-bold text-center text-dark-text mb-2">TradeTok</h1>
                <p className="text-center text-dark-text-secondary mb-8">Log in to continue</p>
                <AuthForm
                    formType="login"
                    onSubmit={handleLogin}
                    loading={isLoading}
                    error={error}
                />
                 <p className="text-center text-dark-text-secondary mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-brand-primary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
