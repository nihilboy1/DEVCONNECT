import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import {useThemeContext} from '../hooks/useThemeContext';
import {Profile} from '../pages/Private/Profile';
import {PrivateStackGroupsRoutes} from './private.stack.groups.routes';
import {PrivateStackPostsRoutes} from './private.stack.posts.routes';

type TabPrivateRoutesList = {
  posts_privateStack: undefined;
  groups_privateStack: undefined;
  search: undefined;
  profile: undefined;
};

export type TabPrivateRoutesProps =
  BottomTabNavigationProp<TabPrivateRoutesList>;
const {Navigator, Screen} = createBottomTabNavigator();

export function TabPrivateRoutes() {
  const {colors, theme} = useThemeContext();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor:
          theme === 'dark' ? colors.text : colors.background,
        tabBarInactiveTintColor: theme === 'dark' ? colors.info : colors.text,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopWidth: 0,
        },
      }}>
      <Screen
        name="posts_privateStack"
        component={PrivateStackPostsRoutes}
        options={{
          tabBarIcon: ({color, size}) => {
            return <AntDesign name="book" color={color} size={size} />;
          },
        }}
      />
      <Screen
        name="groups_privateStack"
        component={PrivateStackGroupsRoutes}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Feather name="message-square" color={color} size={size} />;
          },
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Feather name="user" color={color} size={size} />;
          },
        }}
      />
    </Navigator>
  );
}
