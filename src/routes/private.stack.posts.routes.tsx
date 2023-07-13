import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Posts} from '../pages/Private/Posts';
import {SearchPosts} from '../pages/Private/SearchPosts';
import {UserPosts} from '../pages/Private/UserPosts';

export type userPostsRouteProps = {
  uid: string;
  name: string;
};

type PostsRoutesProps = {
  userposts: userPostsRouteProps;
  searchPosts: undefined;
  posts: undefined;
};

export type PostsStackPrivateRoutesProps =
  NativeStackNavigationProp<PostsRoutesProps>;
const {Navigator, Screen} = createNativeStackNavigator();

export function PrivateStackPostsRoutes() {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="posts" component={Posts} />
      <Screen name="userposts" component={UserPosts} />
      <Screen name="searchPosts" component={SearchPosts} />
    </Navigator>
  );
}
