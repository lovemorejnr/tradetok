
const FOLLOWS_KEY = 'tradetok_follows';

// Data structure: Map<followerId, Set<followingId>>
// Stores "who follows whom"
let followsDb: Map<string, Set<string>> = new Map();

const loadFollows = () => {
    const stored = localStorage.getItem(FOLLOWS_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                followsDb = new Map(parsed.map(([followerId, followingIds]: [string, string[]]) => [followerId, new Set(followingIds)]));
            } else {
                followsDb = new Map();
            }
        } catch (e) {
            console.error("Failed to parse follows", e);
            followsDb = new Map();
        }
    }
};

const saveFollows = () => {
    const serializable = Array.from(followsDb.entries()).map(([followerId, set]) => [followerId, Array.from(set)]);
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(serializable));
};

loadFollows();

export const isFollowing = async (followerId: string, targetId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(followsDb.get(followerId)?.has(targetId) || false);
        }, 100);
    });
};

export const toggleFollow = async (followerId: string, targetId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!followsDb.has(followerId)) {
                followsDb.set(followerId, new Set());
            }

            const following = followsDb.get(followerId)!;
            let isNowFollowing = false;

            if (following.has(targetId)) {
                following.delete(targetId);
                isNowFollowing = false;
            } else {
                following.add(targetId);
                isNowFollowing = true;
            }

            saveFollows();
            resolve(isNowFollowing);
        }, 300);
    });
};
