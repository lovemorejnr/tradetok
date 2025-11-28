
import { Message, User } from '../../types';

const MESSAGES_KEY = 'tradetok_messages';

// Data structure: Map<threadId, Message[]>
// threadId is typically "minId-maxId" of the two user IDs involved
let messagesDb: Record<string, Message[]> = {};

const loadMessages = () => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) {
        try {
            messagesDb = JSON.parse(stored);
        } catch {
            messagesDb = {};
        }
    }
};

const saveMessages = () => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesDb));
};

loadMessages();

export const getThreadId = (user1Id: string, user2Id: string) => {
    return [user1Id, user2Id].sort().join('-');
};

export const getMessages = async (threadId: string): Promise<Message[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(messagesDb[threadId] || []);
        }, 200);
    });
};

export const sendMessage = async (threadId: string, senderId: string, text: string): Promise<Message> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage: Message = {
                id: `m${Date.now()}`,
                senderId,
                text,
                createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
            };

            if (!messagesDb[threadId]) {
                messagesDb[threadId] = [];
            }
            messagesDb[threadId].push(newMessage);
            saveMessages();
            resolve(newMessage);
        }, 300);
    });
};
