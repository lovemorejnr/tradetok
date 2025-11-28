
import { Review, User } from '../../types';
import { mockUsers } from './users';

const REVIEWS_KEY = 'tradetok_reviews';

const getReviewsDb = (): Review[] => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  // Seed initial reviews
  const initialReviews: Review[] = [
    {
      id: 'r1',
      targetUserId: 'u1',
      reviewer: mockUsers[1],
      rating: 5,
      text: 'Item arrived exactly as described. Fast shipping!',
      createdAt: '2 days ago'
    },
    {
      id: 'r2',
      targetUserId: 'u1',
      reviewer: mockUsers[2],
      rating: 4,
      text: 'Great seller, but packaging could be better.',
      createdAt: '1 week ago'
    },
    {
      id: 'r3',
      targetUserId: 'u2',
      reviewer: mockUsers[0],
      rating: 5,
      text: 'Amazing retro collection. Will buy again.',
      createdAt: '3 days ago'
    }
  ];
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews));
  return initialReviews;
};

export const getReviews = async (userId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allReviews = getReviewsDb();
      const userReviews = allReviews.filter(r => r.targetUserId === userId).reverse();
      resolve(userReviews);
    }, 400);
  });
};

export const addReview = async (targetUserId: string, reviewer: User, rating: number, text: string): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        id: `r${Date.now()}`,
        targetUserId,
        reviewer,
        rating,
        text,
        createdAt: 'Just now'
      };
      
      const allReviews = getReviewsDb();
      allReviews.push(newReview);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
      
      resolve(newReview);
    }, 600);
  });
};
