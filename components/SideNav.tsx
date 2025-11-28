
import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from './icons/HomeIcon';
import DiscoverIcon from './icons/DiscoverIcon';
import PostIcon from './icons/PostIcon';
import InboxIcon from './icons/InboxIcon';
import ProfileIcon from './icons/ProfileIcon';
import { useAppContext } from '../context/AppContext';

interface SideNavProps {
  className?: string;
}

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group hover:bg-dark-surface ${
          isActive ? 'text-brand-primary' : 'text-dark-text'
        }`
      }
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-lg font-semibold">{label}</span>
    </NavLink>
  );
};

const SideNav: React.FC<SideNavProps> = ({ className }) => {
  const { user } = useAppContext();

  return (
    <aside className={`bg-dark-bg border-r border-gray-800 p-4 flex flex-col justify-between h-full w-64 ${className}`}>
      <div>
        <div className="mb-8 px-3 pt-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-white bg-clip-text text-transparent">TradeTok</h1>
        </div>
        
        <nav className="space-y-2">
          <NavItem to="/home" icon={<HomeIcon className="w-7 h-7" />} label="For You" />
          <NavItem to="/discover" icon={<DiscoverIcon className="w-7 h-7" />} label="Discover" />
          <NavItem to="/inbox" icon={<InboxIcon className="w-7 h-7" />} label="Inbox" />
          <NavItem to="/profile" icon={<ProfileIcon className="w-7 h-7" />} label="Profile" />
        </nav>
      </div>

      <div className="space-y-4">
        <NavLink 
            to="/post" 
            className="flex items-center justify-center w-full py-3 bg-brand-primary hover:bg-red-600 text-white rounded-md font-bold text-lg shadow-lg transition-all hover:scale-[1.02]"
        >
             <PostIcon className="w-5 h-5 mr-2" />
             Post Item
        </NavLink>

        {user && (
            <div className="flex items-center p-3 rounded-lg bg-dark-surface border border-gray-800">
                <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border border-gray-700" />
                <div className="ml-3 overflow-hidden">
                    <p className="font-bold text-sm truncate">@{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
            </div>
        )}
        
        {/* Demo Indicator */}
        <div className="px-2 pt-2 border-t border-gray-800 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Demo Mode • Mock Data</p>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;