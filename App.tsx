import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {AuthContextProvider} from './src/contexts/AuthContext';
import {Routes} from './src/routes/routes';
import {colors} from './src/theme/theme';
import {toastConfig} from './toastConfig';

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}>
          <StatusBar
            translucent={false}
            barStyle="light-content"
            backgroundColor={colors.background}
          />
          <Routes />
        </SafeAreaView>
      </AuthContextProvider>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}
