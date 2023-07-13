import AS from '@react-native-async-storage/async-storage';

import {USER_KEY} from './storageConfig';

export async function localStoreToken(token: string) {
  await AS.setItem(USER_KEY, token);
}

export async function localGetToken() {
  const token = await AS.getItem(USER_KEY);

  return token;
}

export async function localRemoveToken() {
  await AS.removeItem(USER_KEY);
}
