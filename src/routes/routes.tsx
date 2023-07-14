import {View} from 'react-native';
import {Loading} from '../components/Loading';
import {useAuthContext} from '../hooks/useAuthContext';
import {colors} from '../theme/theme';
import {AuthRoutes} from './auth.routes';
import {TabPrivateRoutes} from './private.tab.routes';

export function Routes() {
  const {loggedInUser, isLocalUserFetched} = useAuthContext();
  if (!isLocalUserFetched) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Loading size={45} spinColor={colors.text} />
      </View>
    );
  }
  return loggedInUser ? <TabPrivateRoutes /> : <AuthRoutes />;
}
