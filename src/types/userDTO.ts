export type userDTO = {
  uid: string;
  name: string;
  avatarUrl: string | null;
  nameInsensitive: string;
  email: string;
  timeStamp: number;
};

export type updateUserDTO = {
  uid?: string;
  name?: string;
  avatarUrl?: string | null;
  nameInsensitive?: string;
  email?: string;
  timeStamp?: number;
};
