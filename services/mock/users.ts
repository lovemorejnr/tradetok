
import { User, Plan } from '../../types';

export let mockUsers: User[] = [
  { 
    id: 'u1', 
    username: 'VintageFinds', 
    email: 'vintagefinds@example.com', 
    avatarUrl: 'https://picsum.photos/seed/u1/48/48',
    plan: 'Premium',
    bannerUrl: 'https://picsum.photos/seed/b1/600/200'
  },
  { 
    id: 'u2', 
    username: 'RetroGamer', 
    email: 'retrogamer@example.com', 
    avatarUrl: 'https://picsum.photos/seed/u2/48/48',
    plan: 'Standard',
    bannerUrl: 'https://picsum.photos/seed/b2/600/200'
  },
  { 
    id: 'u3', 
    username: 'ArtCollector', 
    email: 'artcollector@example.com', 
    avatarUrl: 'https://picsum.photos/seed/u3/48/48',
    plan: 'Basic',
    bannerUrl: 'https://picsum.photos/seed/b3/600/200'
  },
  { 
    id: 'u4', 
    username: 'CoinMaster', 
    email: 'coinmaster@example.com', 
    avatarUrl: 'https://picsum.photos/seed/u4/48/48',
    plan: 'Premium',
    bannerUrl: 'https://picsum.photos/seed/b4/600/200'
  },
];

const SESSION_KEY = 'tradetok_session';

export const getUserById = async (userId: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.id === userId);
            resolve(user);
        }, 300);
    });
};

export const updateUserPlan = async (userId: string, newPlan: Plan): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let updatedUser: User | null = null;
            mockUsers = mockUsers.map(user => {
                if (user.id === userId) {
                    updatedUser = { ...user, plan: newPlan };
                    return updatedUser;
                }
                return user;
            });

            if (updatedUser) {
                // Also update the session if the current user is being updated
                const sessionData = localStorage.getItem(SESSION_KEY);
                if (sessionData) {
                    const sessionUser = JSON.parse(sessionData);
                    if (sessionUser.id === userId) {
                        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
                    }
                }
                resolve(updatedUser);
            } else {
                reject(new Error("User not found"));
            }
        }, 500);
    });
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let updatedUser: User | null = null;
            mockUsers = mockUsers.map(user => {
                if (user.id === userId) {
                    updatedUser = { ...user, ...updates };
                    return updatedUser;
                }
                return user;
            });

            if (updatedUser) {
                // Also update the session if the current user is being updated
                const sessionData = localStorage.getItem(SESSION_KEY);
                if (sessionData) {
                    const sessionUser = JSON.parse(sessionData);
                    if (sessionUser.id === userId) {
                        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
                    }
                }
                resolve(updatedUser);
            } else {
                reject(new Error("User not found"));
            }
        }, 800);
    });
};
