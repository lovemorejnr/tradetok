
import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from './icons/HomeIcon';
import DiscoverIcon from './icons/DiscoverIcon';
import PostIcon from './icons/PostIcon';
import InboxIcon from './icons/InboxIcon';
import ProfileIcon from './icons/ProfileIcon';

interface BottomNavProps {
    className?: string;
}

const NavItem: React.FC<{ to: string; children: React.ReactNode; label: string }> = ({ to, children, label }) => {
  const activeClass = 'text-dark-text';
  const inactiveClass = 'text-dark-text-secondary';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`
      }
    >
      {children}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

const PostButton: React.FC = () => (
  <NavLink
    to="/post"
    className="bg-gradient-to-r from-brand-primary to-pink-500 text-white w-14 h-8 rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
  >
    <PostIcon className="w-6 h-6" />
  </NavLink>
);

const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-16 bg-dark-surface border-t border-gray-800 flex justify-around items-center z-50 ${className}`}>
      <NavItem to="/home" label="Home">
        <HomeIcon className="w-6 h-6" />
      </NavItem>
      <NavItem to="/discover" label="Discover">
        <DiscoverIcon className="w-6 h-6" />
      </NavItem>
      <PostButton />
      <NavItem to="/inbox" label="Inbox">
        <InboxIcon className="w-6 h-6" />
      </NavItem>
      <NavItem to="/profile" label="Profile">
        <ProfileIcon className="w-6 h-6" />
      </NavItem>
    </nav>
  );
};

export default BottomNav;
