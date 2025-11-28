
import { InboxThread, Notification } from '../../types';
import { mockUsers } from './users';
import { getItems } from './items';

// Helper to generate random time strings
const randomTime = () => {
    const times = ['2m', '15m', '1h', '3h', '1d', '2d'];
    return times[Math.floor(Math.random() * times.length)];
};

export const getInboxThreads = async (userId: string): Promise<InboxThread[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Filter out the current user so they don't chat with themselves
            const potentialChatters = mockUsers.filter(u => u.id !== userId);
            
            if (potentialChatters.length === 0) {
                resolve([]);
                return;
            }

            const threads: InboxThread[] = [
                {
                    id: 't1',
                    otherUser: potentialChatters[0],
                    lastMessage: 'Is this item still available?',
                    updatedAt: '2m',
                    unreadCount: 1,
                },
                {
                    id: 't2',
                    otherUser: potentialChatters[1] || potentialChatters[0],
                    lastMessage: 'I can offer R 450 for it.',
                    updatedAt: '1h',
                    unreadCount: 0,
                },
                {
                    id: 't3',
                    otherUser: potentialChatters[2] || potentialChatters[0],
                    lastMessage: 'Thanks for the quick delivery!',
                    updatedAt: '1d',
                    unreadCount: 0,
                }
            ];
            
            // Return valid threads (in case fewer users exist)
            resolve(threads.filter(t => t.otherUser));
        }, 600);
    });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    return new Promise(async (resolve) => {
        // Simulate fetching some items for the "relatedItem" field
        const { items } = await getItems(1, 5, userId);
        const randomItem = items[0];
        
        const otherUsers = mockUsers.filter(u => u.id !== userId);

        setTimeout(() => {
            const notifications: Notification[] = [
                {
                    id: 'n1',
                    userId,
                    type: 'like',
                    text: `liked your ${randomItem?.title || 'item'}`,
                    createdAt: '5m',
                    isRead: false,
                    relatedUser: otherUsers[0],
                    relatedItem: randomItem ? { id: randomItem.id, imageUrl: randomItem.imageUrl } : undefined,
                },
                {
                    id: 'n2',
                    userId,
                    type: 'follow',
                    text: 'started following you',
                    createdAt: '2h',
                    isRead: true,
                    relatedUser: otherUsers[1] || otherUsers[0],
                },
                {
                    id: 'n3',
                    userId,
                    type: 'offer',
                    text: 'made an offer of R 300',
                    createdAt: '5h',
                    isRead: true,
                    relatedUser: otherUsers[2] || otherUsers[0],
                    relatedItem: randomItem ? { id: randomItem.id, imageUrl: randomItem.imageUrl } : undefined,
                },
                {
                    id: 'n4',
                    userId,
                    type: 'system',
                    text: 'Welcome to TradeTok! Complete your profile to get started.',
                    createdAt: '1w',
                    isRead: true,
                }
            ];

            resolve(notifications);
        }, 600);
    });
};
