import { Plan } from '../../types';

const UPLOADS_KEY = 'tradetok_uploads';

// Data structure: Map<userId, { count: number, month: string }>
// e.g. month: "2023-10"

const getUploadsDb = (): Map<string, { count: number, month: string }> => {
    const stored = localStorage.getItem(UPLOADS_KEY);
    if (stored) {
        try {
            return new Map(JSON.parse(stored));
        } catch {
            return new Map();
        }
    }
    return new Map();
};

const saveUploadsDb = (db: Map<string, { count: number, month: string }>) => {
    localStorage.setItem(UPLOADS_KEY, JSON.stringify(Array.from(db.entries())));
};

const getCurrentMonth = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getUploadCount = async (userId: string): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const db = getUploadsDb();
            const userData = db.get(userId);
            const currentMonth = getCurrentMonth();

            if (userData && userData.month === currentMonth) {
                resolve(userData.count);
            } else {
                // If new month or no data, count is 0
                resolve(0);
            }
        }, 100);
    });
};

export const incrementUploadCount = async (userId: string): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const db = getUploadsDb();
            const userData = db.get(userId);
            const currentMonth = getCurrentMonth();

            if (userData && userData.month === currentMonth) {
                userData.count++;
            } else {
                // First upload of the month
                db.set(userId, { count: 1, month: currentMonth });
            }
            saveUploadsDb(db);
            resolve();
        }, 100);
    });
};

export const getPlanLimit = (plan: Plan): number => {
    switch (plan) {
        case 'Basic':
            return 10;
        case 'Standard':
            return 30;
        case 'Premium':
            return Infinity;
        default:
            return 0;
    }
};