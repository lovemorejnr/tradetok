
import { Item, User } from '../../types';
import { isLiked } from './likes';
import { mockUsers } from './users';

const mockItems: Item[] = [
  {
    id: 'i1',
    user: mockUsers[0],
    imageUrl: 'https://picsum.photos/seed/i1/400/700',
    images: ['https://picsum.photos/seed/i1/400/700', 'https://picsum.photos/seed/i1-2/400/700', 'https://picsum.photos/seed/i1-3/400/700'],
    title: 'Vintage Leather Armchair',
    description: 'Classic 1950s leather armchair. In great condition, perfect for a reading nook. Minor wear on the right armrest adds to its character. A timeless piece for any living room.',
    likes: 1204,
    comments: 88,
    value: 450,
  },
  {
    id: 'i2',
    user: mockUsers[1],
    imageUrl: 'https://picsum.photos/seed/i2/400/700',
    images: ['https://picsum.photos/seed/i2/400/700', 'https://picsum.photos/seed/i2-back/400/700'],
    title: 'Nintendo 64 Console Bundle',
    description: 'Original Nintendo 64 console with two controllers and GoldenEye 007. A true classic! Fully tested and working. Comes with all necessary cables.',
    likes: 3450,
    comments: 256,
    value: 200,
  },
  {
    id: 'i3',
    user: mockUsers[2],
    imageUrl: 'https://picsum.photos/seed/i3/400/700',
    images: ['https://picsum.photos/seed/i3/400/700'],
    title: 'Signed Abstract Painting',
    description: 'Signed abstract painting by a local artist. Vibrant colors, a real statement piece. Measures 24x36 inches. Perfect for modern home decor.',
    likes: 876,
    comments: 42,
    value: 1200,
  },
  {
    id: 'i4',
    user: mockUsers[3],
    imageUrl: 'https://picsum.photos/seed/i4/400/700',
    images: ['https://picsum.photos/seed/i4/400/700'],
    title: 'Rare Silver Dollar Collection',
    description: 'A collection of 10 rare Morgan silver dollars from the 1880s. Graded and preserved in capsules. A must-have for any serious numismatist.',
    likes: 2150,
    comments: 150,
    value: 3500,
  },
  {
    id: 'i5',
    user: mockUsers[0],
    imageUrl: 'https://picsum.photos/seed/i5/400/700',
    images: ['https://picsum.photos/seed/i5/400/700'],
    title: 'Antique Gramophone',
    description: 'Working 1920s HMV gramophone. Beautiful wooden cabinet and brass horn. Includes a collection of 20 vintage records.',
    likes: 950,
    comments: 65,
    value: 800,
  },
  {
    id: 'i6',
    user: mockUsers[1],
    imageUrl: 'https://picsum.photos/seed/i6/400/700',
    images: ['https://picsum.photos/seed/i6/400/700'],
    title: 'Sega Genesis with 10 Games',
    description: 'The rival to the SNES. Comes with Sonic the Hedgehog 1 & 2, Streets of Rage, and more. All in original boxes.',
    likes: 1800,
    comments: 190,
    value: 250,
  },
   {
    id: 'i7',
    user: mockUsers[2],
    imageUrl: 'https://picsum.photos/seed/i7/400/700',
    images: ['https://picsum.photos/seed/i7/400/700'],
    title: 'Handcrafted Wooden Chess Set',
    description: 'Exquisite, hand-carved wooden chess set from Eastern Europe. Each piece is a work of art. The board itself is inlaid with walnut and maple.',
    likes: 730,
    comments: 33,
    value: 300,
  },
  {
    id: 'i8',
    user: mockUsers[3],
    imageUrl: 'https://picsum.photos/seed/i8/400/700',
    images: ['https://picsum.photos/seed/i8/400/700'],
    title: '19th Century Telescope',
    description: 'A beautiful brass telescope on a mahogany tripod. Still functional, offers clear views of the moon and planets. Made by renowned London opticians.',
    likes: 1100,
    comments: 95,
    value: 1800,
  },
   {
    id: 'i9',
    user: mockUsers[0],
    imageUrl: 'https://picsum.photos/seed/i9/400/700',
    images: ['https://picsum.photos/seed/i9/400/700'],
    title: 'Set of 4 Eames Style Chairs',
    description: 'Mid-century modern dining chairs. Replica, but high-quality. Perfect condition, barely used. A design icon.',
    likes: 600,
    comments: 50,
    value: 400,
  },
];

export const getItems = async (page: number = 1, limit: number = 3, userId: string): Promise<{ items: Item[], hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allItems = [...mockItems].reverse();
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedItems = allItems.slice(start, end);
      
      const itemsWithLikes = paginatedItems.map(item => ({
        ...item,
        isLiked: isLiked(userId, item.id),
      }));

      resolve({
        items: itemsWithLikes,
        hasMore: end < allItems.length,
      });
    }, 500);
  });
};

export const getItemsByUserId = async (userId: string): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userItems = mockItems.filter(item => item.user.id === userId).reverse();
      resolve(userItems);
    }, 300);
  });
};

export interface CreateItemData {
  title: string;
  description: string;
  value: number;
  user: User;
  imageUrls: string[];
}

export const createItem = async (itemData: CreateItemData): Promise<Item> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: Item = {
        id: `i${mockItems.length + 1}`,
        user: itemData.user,
        imageUrl: itemData.imageUrls[0] || `https://picsum.photos/seed/new${mockItems.length + 1}/400/700`,
        images: itemData.imageUrls.length > 0 ? itemData.imageUrls : [`https://picsum.photos/seed/new${mockItems.length + 1}/400/700`],
        title: itemData.title,
        description: itemData.description,
        value: itemData.value,
        likes: 0,
        comments: 0,
      };
      mockItems.push(newItem);
      resolve(newItem);
    }, 1500);
  });
};
