import AS from '@react-native-async-storage/async-storage';
import {userDTO} from '../../types/userDTO';
const USER_KEY = '@devConnect:user';

export const AsyncStorageUser = {
  Set: async (user: userDTO) => {
    await AS.setItem(USER_KEY, JSON.stringify(user));
  },

  Get: async () => {
    const storedUser = await AS.getItem(USER_KEY);
    const user: userDTO = storedUser ? JSON.parse(storedUser) : {};
    return user;
  },

  Delete: async () => {
    await AS.removeItem(USER_KEY);
  },
};
