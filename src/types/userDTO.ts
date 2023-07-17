export type inUseThemeProps = 'dark' | 'light';

export type userDTO = {
  uid: string;
  name: string;
  avatarUrl: string | null;
  inUseTheme: inUseThemeProps;
  nameInsensitive: string;
  email: string;
  timeStamp: number;
};

export type updateUserDTO = {
  uid?: string;
  name?: string;
  inUseTheme?: inUseThemeProps;
  avatarUrl?: string | null;
  nameInsensitive?: string;
  email?: string;
  timeStamp?: number;
};
