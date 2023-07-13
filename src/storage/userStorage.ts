import AS from '@react-native-async-storage/async-storage';

import {userDTO} from '../types/userDTO';
import {USER_KEY} from './storageConfig';

export async function localStorageSetUser(user: userDTO) {
  await AS.setItem(USER_KEY, JSON.stringify(user));
}

export async function localStorageGetUser() {
  const storedUser = await AS.getItem(USER_KEY);
  const user: userDTO = storedUser ? JSON.parse(storedUser) : {};

  return user;
}

export async function localStorageDeleteUser() {
  await AS.removeItem(USER_KEY);
}
