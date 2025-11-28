
import { User } from '../../types';

export interface AuthCredentials {
    email: string;
    password?: string;
    username?: string;
    avatarBase64?: string | null;
    bannerBase64?: string | null;
}

const SESSION_KEY = 'tradetok_session';
const USERS_KEY = 'tradetok_users';

// Initialize with a default user for demonstration
const getMockUsers = (): Map<string, User> => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) {
        return new Map(JSON.parse(storedUsers));
    }
    const defaultUsers = new Map<string, User>();
    const defaultUser: User = {
        id: 'u4',
        email: 'test@test.com',
        username: 'TestUser',
        avatarUrl: 'https://picsum.photos/seed/u4/48/48',
        plan: 'Basic',
    };
    defaultUsers.set(defaultUser.email, defaultUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(Array.from(defaultUsers.entries())));
    return defaultUsers;
};

let mockUsersDb = getMockUsers();

export const mockLogin = async ({ email }: AuthCredentials): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usersArray = Array.from(getMockUsers().values());
            const user = usersArray.find(u => u.email === email);
            
            if (user) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
};

export const mockSignup = async ({ email, username, avatarBase64, bannerBase64 }: AuthCredentials): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!email || !username) {
                return reject(new Error('Email and username are required.'));
            }
            const usersArray = Array.from(getMockUsers().values());
            if (usersArray.some(u => u.email === email)) {
                return reject(new Error('User with this email already exists.'));
            }
            const currentUsers = getMockUsers();
            
            const newUser: User = {
                id: `u${currentUsers.size + 1}`,
                email,
                username,
                avatarUrl: avatarBase64 || `https://picsum.photos/seed/${username}/48/48`,
                bannerUrl: bannerBase64 || `https://picsum.photos/seed/${username}-banner/600/200`,
                plan: 'Basic', // Assign Basic plan by default
            };
            currentUsers.set(email, newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(Array.from(currentUsers.entries())));
            localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
            resolve(newUser);
        }, 1000);
    });
};

export const mockLogout = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const mockGetSession = async (): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sessionData = localStorage.getItem(SESSION_KEY);
            if (sessionData) {
                resolve(JSON.parse(sessionData));
            } else {
                resolve(null);
            }
        }, 200);
    });
};
