import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {GroupChat} from '../pages/Private/GroupChat';
import {Groups} from '../pages/Private/Groups';

type GroupsRoutesProps = {
  groups: undefined;
  groupChat: {groupName: string; groupId: string};
};

export type GroupsStackPrivateRoutesProps =
  NativeStackNavigationProp<GroupsRoutesProps>;
const {Navigator, Screen} = createNativeStackNavigator();

export function PrivateStackGroupsRoutes() {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="groups" component={Groups} />
      <Screen name="groupChat" component={GroupChat} />
    </Navigator>
  );
}
