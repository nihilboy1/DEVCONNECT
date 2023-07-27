import {View} from 'react-native';
import {Loading} from '../components/Loading';
import {useAuthContext} from '../hooks/useAuthContext';
import {useThemeContext} from '../hooks/useThemeContext';
import {AuthRoutes} from './auth.routes';
import {TabPrivateRoutes} from './private.tab.routes';

export function Routes() {
  const {loggedInUser, isLocalUserFetched} = useAuthContext();
  const {colors} = useThemeContext();

  if (!isLocalUserFetched) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <Loading size={45} spinColor={colors.text} />
      </View>
    );
  }
  return loggedInUser ? <TabPrivateRoutes /> : <AuthRoutes />;
}
