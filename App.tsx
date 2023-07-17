import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {AuthContextProvider} from './src/contexts/AuthContext';
import {ThemeContextProvider} from './src/contexts/ThemeContext';
import {Routes} from './src/routes/routes';
import {toastConfig} from './src/utils/toastConfig';

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <ThemeContextProvider>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: '#161A26',
            }}>
            <StatusBar
              translucent={false}
              barStyle="light-content"
              backgroundColor="#161A26"
            />
            <Routes />
          </SafeAreaView>
          <Toast config={toastConfig} />
        </ThemeContextProvider>
      </AuthContextProvider>
    </NavigationContainer>
  );
}
