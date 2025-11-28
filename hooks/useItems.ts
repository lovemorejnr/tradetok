import { useState, useEffect, useRef, useCallback } from 'react';
import { Item, User } from '../types';
import { getItems } from '../services/mock/items';
import { toggleLike as toggleLikeService } from '../services/mock/likes';

export const useItems = (user: User | null) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // FIX: Initialize useRef with null and update the type to allow for null.
  // This resolves the error "Expected 1 arguments, but got 0." by providing an initial value.
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchItems = useCallback(async (pageNum: number) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { items: newItems, hasMore: newHasMore } = await getItems(pageNum, 3, user.id);
      setItems(prevItems => (pageNum === 1 ? newItems : [...new Set([...prevItems, ...newItems].map(i => i.id))].map(id => [...prevItems, ...newItems].find(i => i.id === id)!)));
      setHasMore(newHasMore);
    } catch (err) {
      setError('Failed to fetch items.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1);
  }, [fetchItems]);
  
  const lastItemElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
      if (page > 1) {
          fetchItems(page);
      }
  }, [page, fetchItems]);

  const toggleItemLike = useCallback(async (itemId: string) => {
    if (!user) return;
    
    setItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));

    try {
        await toggleLikeService(user.id, itemId);
    } catch (error) {
        console.error("Failed to toggle like", error);
        setItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    isLiked: !item.isLiked,
                    likes: item.isLiked ? item.likes - 1 : item.likes + 1,
                };
            }
            return item;
        }));
    }
  }, [user]);

  return { items, isLoading, error, lastItemElementRef, toggleItemLike, hasMore };
};
