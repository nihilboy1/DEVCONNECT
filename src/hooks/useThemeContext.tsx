import {useContext} from 'react';
import {ThemeContext} from '../contexts/ThemeContext';

export function useThemeContext() {
  const context = useContext(ThemeContext);
  return context;
}
