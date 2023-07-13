import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {SignIn} from '../pages/Auth/SignIn';
import {SignUp} from '../pages/Auth/SignUp';

type StackAuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type StackAuthRoutesProps = NativeStackNavigationProp<StackAuthRoutes>;
const {Navigator, Screen} = createNativeStackNavigator();
export function AuthRoutes() {
  return (
    <Navigator>
      <Screen name="signIn" component={SignIn} options={{headerShown: false}} />
      <Screen name="signUp" component={SignUp} options={{headerShown: false}} />
    </Navigator>
  );
}
