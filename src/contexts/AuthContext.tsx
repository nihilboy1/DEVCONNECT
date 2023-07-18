import {createContext, ReactNode, useEffect, useState} from 'react';
import {AsyncStorageUser} from '../connection/AsyncStorage/userStorage';
import {FirebaseUserAuth} from '../connection/Firebase/auth';
import {FirebaseUsersDatabase} from '../connection/Firebase/database';
import {inUseThemeProps, userDTO} from '../types/userDTO';
import {showToast} from '../utils/toastConfig';

type ContextDataProps = {
  loggedInUser: boolean;
  isLocalUserFetched: boolean;
  user: userDTO | null;
  isAuthLoading: boolean;
  setUser: (user: userDTO) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<ContextDataProps>(
  {} as ContextDataProps,
);

type ContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({children}: ContextProviderProps) {
  const [user, setUser] = useState<userDTO | null>(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLocalUserFetched, setIsLocalUserFetched] = useState(false);

  async function signUp(email: string, password: string, name: string) {
    try {
      setIsAuthLoading(true);
      const uid = await FirebaseUserAuth.Create(email, password);
      if (uid !== undefined) {
        const user = {
          uid,
          name,
          inUseTheme: 'dark' as inUseThemeProps,
          avatarUrl: null,
          nameInsensitive: name.toUpperCase(),
          email,
          timeStamp: Date.now(),
        };
        await FirebaseUsersDatabase.Set(user, uid);
        await signIn(email, password);
        showToast('success', 'bottom', 'Sucessfully registered');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsAuthLoading(true);
      const uid = await FirebaseUserAuth.Connect(email, password);
      if (uid !== undefined) {
        const response = await FirebaseUsersDatabase.Get(uid);
        if (response !== undefined) {
          const user: userDTO = {
            uid: response.uid,
            inUseTheme: response.inUseTheme,
            name: response.name,
            nameInsensitive: response.nameInsensitive,
            email: response.email,
            timeStamp: response.timeStamp,
            avatarUrl: response.avatarUrl,
          };
          await AsyncStorageUser.Set(user);
          setUser(user);
          setLoggedInUser(true);
        }
      }
    } catch (error) {
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function asyncStorageGetUser() {
    try {
      setIsLocalUserFetched(false);
      const user = await AsyncStorageUser.Get();
      if (user.uid !== undefined) {
        setUser(user);
        setLoggedInUser(true);
      }
    } catch {
    } finally {
      setIsLocalUserFetched(true);
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorageUser.Delete();
    await FirebaseUserAuth.Disconnect();
    setIsAuthLoading(false);
    setLoggedInUser(false);
  }

  useEffect(() => {
    asyncStorageGetUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLocalUserFetched,
        isAuthLoading,
        loggedInUser,
        signUp,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
