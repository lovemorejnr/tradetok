
import { User, Item } from '../../types';

export const makeOffer = async (item: Item, user: User, amount: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Offer of ${amount} made by ${user.username} on item ${item.id}`);
            // In a real app, this would send a POST request to the backend
            resolve(true);
        }, 1500);
    });
};
