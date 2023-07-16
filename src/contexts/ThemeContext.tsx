import {ReactNode, createContext, useState} from 'react';

type ContextDataProps = {
  colors: {
    primary: string;
    success: string;
    danger: string;
    info: string;
    background: string;
    text: string;
    overlay: string;
  };
  fonts: {
    mono: string;
    regular: string;
    medium: string;
    bold: string;
  };
  theme: 'dark' | 'light';
  setTheme: (value: 'dark' | 'light') => void;
};

export const ThemeContext = createContext<ContextDataProps>(
  {} as ContextDataProps,
);

type ContextProviderProps = {
  children: ReactNode;
};

export function ThemeContextProvider({children}: ContextProviderProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const colors = {
    primary: theme === 'dark' ? '#2D3240' : '#6C6D73',
    success: theme === 'dark' ? '#dcf8c5' : '#6f9a4d',
    danger: '#ee6b6e',
    info: theme === 'dark' ? '#6C6D73' : '#2D3240',
    background: theme === 'dark' ? '#161A26' : '#f2f2f2',
    text: theme === 'dark' ? '#F2F2F2' : '#161A26',
    overlay: 'rgba(7, 12, 32, 0.5)',
  };

  const fonts = {
    mono: 'CutiveMono-Regular',
    regular: 'Rubik-Regular',
    medium: 'Rubik-Medium',
    bold: 'Rubik-Bold',
  };

  return (
    <ThemeContext.Provider value={{colors, fonts, theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
