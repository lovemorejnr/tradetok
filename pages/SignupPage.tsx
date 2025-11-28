
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AuthForm from '../components/AuthForm';
import { AuthCredentials } from '../services/mock/auth';

const SignupPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signup } = useAppContext();
    const navigate = useNavigate();

    const handleSignup = async (credentials: AuthCredentials) => {
        setError(null);
        setIsLoading(true);
        try {
            await signup(credentials);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-bold text-center text-dark-text mb-2">Join TradeTok</h1>
                <p className="text-center text-dark-text-secondary mb-8">Create an account to start trading.</p>
                <AuthForm
                    formType="signup"
                    onSubmit={handleSignup}
                    loading={isLoading}
                    error={error}
                />
                 <p className="text-center text-dark-text-secondary mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-primary hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
