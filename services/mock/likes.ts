const LIKES_KEY = 'tradetok_likes';

// Data structure: Map<userId, Set<itemId>>
let likesDb: Map<string, Set<string>> = new Map();

const loadLikes = () => {
    const storedLikes = localStorage.getItem(LIKES_KEY);
    if (storedLikes) {
        try {
            // Safely parse and reconstruct the Map and Set
            const parsed = JSON.parse(storedLikes);
            if (Array.isArray(parsed)) {
                likesDb = new Map(parsed.map(([userId, itemIds]: [string, string[]]) => [userId, new Set(itemIds)]));
            } else {
                 likesDb = new Map();
            }
        } catch (e) {
            console.error("Failed to parse likes from localStorage", e);
            likesDb = new Map();
        }
    }
};

const saveLikes = () => {
    // Convert Map and Set to arrays for JSON serialization
    const serializable = Array.from(likesDb.entries()).map(([userId, itemIdsSet]) => [userId, Array.from(itemIdsSet)]);
    localStorage.setItem(LIKES_KEY, JSON.stringify(serializable));
};

loadLikes();

export const isLiked = (userId: string, itemId: string): boolean => {
    return likesDb.get(userId)?.has(itemId) || false;
};

export const toggleLike = async (userId: string, itemId:string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!likesDb.has(userId)) {
                likesDb.set(userId, new Set());
            }
            
            const userLikes = likesDb.get(userId)!;
            let liked;
            if (userLikes.has(itemId)) {
                userLikes.delete(itemId);
                liked = false;
            } else {
                userLikes.add(itemId);
                liked = true;
            }
            
            saveLikes();
            resolve(liked);
        }, 200); // Simulate network delay
    });
};