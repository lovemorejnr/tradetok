
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plan } from '../types';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface PlanDetails {
  name: Plan;
  price: string;
  features: string[];
  cta: string;
  color: string;
  popular?: boolean;
}

const plans: PlanDetails[] = [
  {
    name: 'Basic',
    price: 'R 99/mo',
    features: ['10 uploads per month', 'Standard visibility', 'Basic support'],
    cta: 'Your Current Plan',
    color: 'border-gray-500',
  },
  {
    name: 'Standard',
    price: 'R 199/mo',
    features: ['30 uploads per month', 'Promoted visibility', 'Priority support'],
    cta: 'Upgrade to Standard',
    color: 'border-blue-500',
    popular: true,
  },
  {
    name: 'Premium',
    price: 'R 399/mo',
    features: ['Unlimited uploads', 'Top visibility', '24/7 dedicated support'],
    cta: 'Upgrade to Premium',
    color: 'border-purple-500',
  },
];

const PlanCard: React.FC<{ plan: PlanDetails, isCurrent: boolean, onSelect: () => void, isLoading: boolean }> = ({ plan, isCurrent, onSelect, isLoading }) => {
  const isSelectable = !isCurrent;
  
  return (
    <div className={`relative bg-dark-surface p-6 rounded-2xl border-2 ${isCurrent ? plan.color : (plan.popular ? 'border-brand-primary' : 'border-gray-800')} transition-all duration-300 ${isSelectable ? 'hover:scale-[1.02] hover:border-gray-600' : ''} flex flex-col`}>
      {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Most Popular
          </div>
      )}
      <h3 className={`text-xl font-bold ${isCurrent ? 'text-brand-secondary' : 'text-white'}`}>{plan.name}</h3>
      <p className="text-3xl font-extrabold my-4 text-white">{plan.price}</p>
      <div className="w-full h-px bg-gray-800 mb-4"></div>
      <ul className="space-y-3 text-gray-300 mb-8 flex-1">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-start text-sm">
            <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={!isSelectable || isLoading}
        className={`w-full py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
          isCurrent
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : (plan.popular ? 'bg-brand-primary text-white hover:bg-red-600' : 'bg-white text-black hover:bg-gray-200')
        } disabled:opacity-50`}
      >
        {isCurrent ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

const PlansPage: React.FC = () => {
  const { user, updatePlan } = useAppContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan === user?.plan) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updatePlan(plan);
      setSuccess(`Successfully upgraded to the ${plan} plan!`);
    } catch (err: any) {
      setError(err.message || 'Failed to update plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-full bg-dark-bg text-dark-text p-4 pb-20 md:pb-0 md:p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 rounded-full bg-dark-surface hover:bg-gray-800 transition-colors z-10 text-white shadow-lg border border-gray-800"
        aria-label="Go back"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <div className="text-center mb-8 md:mb-12 pt-12 md:pt-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Upgrade Your Shop</h1>
        <p className="text-gray-400 text-lg">Unlock more uploads and reach more buyers.</p>
      </div>
      
      {error && <div className="p-3 mb-4 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-sm text-center max-w-2xl mx-auto">{error}</div>}
      {success && <div className="p-3 mb-4 bg-green-900/50 border border-green-800 rounded-lg text-green-200 text-sm text-center max-w-2xl mx-auto">{success}</div>}
      
      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 max-w-6xl mx-auto px-2">
        {plans.map(plan => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isCurrent={user?.plan === plan.name}
            onSelect={() => handleSelectPlan(plan.name)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
