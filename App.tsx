
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import PostPage from './pages/PostPage';
import InboxPage from './pages/InboxPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider, useAppContext } from './context/AppContext';
import ShopProfilePage from './pages/ShopProfilePage';
import PlansPage from './pages/PlansPage';
import SettingsPage from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { isModalOpen, setModalOpen } = useAppContext();
  const location = useLocation();

  // Check if we are in a chat view
  const isChatPage = location.pathname.startsWith('/chat/');

  // Reset modal state when route changes
  useEffect(() => {
    setModalOpen(false);
  }, [location, setModalOpen]);

  return (
    <div className="h-screen w-full font-sans bg-dark-bg text-dark-text flex flex-col md:flex-row overflow-hidden">
      {/* Hide SideNav on mobile, show on desktop unless it's a fullscreen-ish page that needs focus, though typically SideNav persists on desktop */}
      {!isModalOpen && <SideNav className="hidden md:flex flex-shrink-0" />}
      
      <main className="flex-grow h-full overflow-y-auto relative no-scrollbar md:pb-0 scroll-smooth">
         {/* Adjust padding for bottom nav only if not in chat and not modal */}
         <div className={`w-full min-h-full ${!isModalOpen && !isChatPage ? 'pb-16 md:pb-0' : ''}`}>
           <Outlet />
         </div>
         {/* Hide BottomNav if modal is open OR if we are on Chat Page */}
         {!isModalOpen && !isChatPage && <BottomNav className="md:hidden" />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/post" element={<PostPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/chat/:threadId" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ShopProfilePage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
