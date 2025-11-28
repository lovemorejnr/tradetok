
import { Comment, User } from '../../types';
import { mockUsers } from './users';

// Seed some initial comments
let mockComments: Comment[] = [
  { 
    id: 'c1', 
    itemId: 'i1', 
    user: mockUsers[1], 
    text: 'Is this still available? I am very interested!', 
    createdAt: '2h ago' 
  },
  { 
    id: 'c2', 
    itemId: 'i1', 
    user: mockUsers[2], 
    text: 'The condition looks amazing for its age.', 
    createdAt: '1h ago' 
  },
  { 
    id: 'c3', 
    itemId: 'i2', 
    user: mockUsers[0], 
    text: 'Does it come with the expansion pak?', 
    createdAt: '30m ago' 
  },
  { 
    id: 'c4', 
    itemId: 'i2', 
    user: mockUsers[3], 
    text: 'Classic console. Best of all time.', 
    createdAt: '15m ago' 
  },
];

export const getComments = async (itemId: string): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return comments for the specific item, sorted by newest first (conceptually, though mock dates are strings)
      const itemComments = mockComments.filter(c => c.itemId === itemId);
      resolve(itemComments);
    }, 400); // Simulate network delay
  });
};

export const addComment = async (itemId: string, user: User, text: string): Promise<Comment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        itemId,
        user,
        text,
        createdAt: 'Just now',
      };
      
      // Add to beginning of array
      mockComments = [newComment, ...mockComments];
      
      resolve(newComment);
    }, 400);
  });
};
