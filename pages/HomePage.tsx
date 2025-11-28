
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useItems } from '../hooks/useItems';
import ItemCard from '../components/ItemCard';

const LoadingCard: React.FC = () => (
  <div className="relative h-[calc(100vh-4rem)] md:h-screen snap-start flex items-center justify-center bg-dark-surface">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
  </div>
);

const HomePage: React.FC = () => {
  const { user } = useAppContext();
  const { items, isLoading, error, lastItemElementRef, toggleItemLike, hasMore } = useItems(user);

  if (isLoading && items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="snap-y snap-mandatory h-full overflow-y-scroll overflow-x-hidden w-full max-w-md mx-auto md:border-x md:border-gray-800">
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return (
            <div ref={lastItemElementRef} key={item.id}>
              <ItemCard item={item} onLike={toggleItemLike} />
            </div>
          );
        }
        return <ItemCard key={item.id} item={item} onLike={toggleItemLike} />;
      })}
      {isLoading && <LoadingCard />}
      {!isLoading && !hasMore && items.length > 0 && (
        <div className="h-60 md:h-screen snap-start flex flex-col items-center justify-center text-center p-4 bg-dark-bg">
            <h2 className="text-2xl font-bold text-gray-200">You've Reached the End</h2>
            <p className="text-dark-text-secondary mt-2">Check back later for new items!</p>
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-4 px-4 py-2 bg-dark-surface rounded-full text-sm font-semibold hover:bg-gray-800 transition"
            >
                Back to Top
            </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
