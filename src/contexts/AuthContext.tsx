import {ReactNode, createContext, useEffect, useState} from 'react';
import {FirebaseAuth} from '../connection/Firebase/auth';
import {FirebaseUsersDatabase} from '../connection/Firebase/database';
import {
  localStorageDeleteUser,
  localStorageGetUser,
  localStorageSetUser,
} from '../storage/userStorage';
import {userDTO} from '../types/userDTO';

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
      const response = await FirebaseAuth.CreateUser(email, password);
      if (response?.user.uid !== undefined) {
        const uid = response.user.uid;
        const user = {
          uid,
          name,
          avatarUrl: null,
          nameInsensitive: name.toUpperCase(),
          email,
          timeStamp: Date.now(),
        };
        await FirebaseUsersDatabase.Set(user, uid);
        await signIn(email, password);
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
      const uid = await FirebaseAuth.ConnectUser(email, password);
      if (uid !== undefined) {
        const response = await FirebaseUsersDatabase.Get(uid);
        if (response !== undefined) {
          const user: userDTO = {
            uid: response.uid,
            name: response.name,
            nameInsensitive: response.nameInsensitive,
            email: response.email,
            timeStamp: response.timeStamp,
            avatarUrl: response.avatarUrl,
          };
          await localStorageSetUser(user);
          setUser(user);
          setLoggedInUser(true);
        }
      }
    } catch (error) {
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function handleLocalStorageGetUser() {
    try {
      setIsLocalUserFetched(false);
      const user = await localStorageGetUser();
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
    await localStorageDeleteUser();
    await FirebaseAuth.DisconnectUser();
    setIsAuthLoading(false);
    setLoggedInUser(false);
  }

  useEffect(() => {
    handleLocalStorageGetUser();
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
