
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Plan } from '../types';
import { mockLogin, mockSignup, mockLogout, mockGetSession, AuthCredentials } from '../services/mock/auth';
import { updateUserPlan, updateUserProfile } from '../services/mock/users';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isModalOpen: boolean;
  login: (credentials: AuthCredentials) => Promise<User>;
  signup: (credentials: AuthCredentials) => Promise<User>;
  logout: () => void;
  updatePlan: (plan: Plan) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setModalOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await mockGetSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Failed to retrieve session", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      const loggedInUser = await mockLogin(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      const newUser = await mockSignup(credentials);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    mockLogout();
    setUser(null);
  };

  const updatePlan = async (plan: Plan) => {
    if (!user) throw new Error("User not authenticated");
    try {
      const updatedUser = await updateUserPlan(user.id, plan);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update plan", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("User not authenticated");
    try {
      const updatedUser = await updateUserProfile(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isModalOpen,
    login,
    signup,
    logout,
    updatePlan,
    updateProfile,
    setModalOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
