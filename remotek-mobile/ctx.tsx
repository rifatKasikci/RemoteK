import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { signIn, register } from './lib/services/authService';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  register: (user: User) => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  register: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          const token = await signIn(email, password)
          console.log(token);
          SecureStore.setItem('userToken', token.access_token);
          Alert.alert('Login Successful!');
          setSession(token);
          router.replace('/');
        },
        signOut: () => {
          SecureStore.deleteItemAsync('userToken');
          setSession(null);
        },
        register: async (user: User) => {
          const token = await register(user);
          SecureStore.setItem('userToken', token.access_token);
          Alert.alert('Registration Successful!');
          setSession(token);
          router.replace('/');
        },
        session: SecureStore.getItem('userToken'),
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
