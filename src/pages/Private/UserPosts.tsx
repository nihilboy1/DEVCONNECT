import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {CaretLeft} from 'phosphor-react-native';
import {useCallback, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PostsList} from '../../components/PostsList';
import {FirebasePostsDatabase} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {useThemeContext} from '../../hooks/useThemeContext';
import {userPostsRouteProps} from '../../routes/private.stack.posts.routes';
import {getPostDTO} from '../../types/postDTO';

export function UserPosts() {
  const {user} = useAuthContext();
  const {colors, theme} = useThemeContext();

  const {goBack} = useNavigation();
  const [userPosts, setUserPosts] = useState<getPostDTO[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const {params} = useRoute();
  const {uid, name} = params as userPostsRouteProps;

  async function getAllPostsFromAUser() {
    try {
      setIsLoadingPosts(true);
      FirebasePostsDatabase.GetAllFromAUser(uid).then(posts => {
        setUserPosts(posts);
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingPosts(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllPostsFromAUser();
    }, []),
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        borderWidth: 1,
        padding: 10,
        backgroundColor: colors.background,
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Pressable
          style={{
            backgroundColor: colors.info,
            borderRadius: 5,
            padding: 2,
            paddingHorizontal: 8,
            paddingRight: 10,
          }}
          onPress={() => goBack()}>
          <CaretLeft
            size={32}
            color={theme === 'dark' ? colors.text : colors.background}
          />
        </Pressable>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 30,
            marginTop: 5,
            marginBottom: 10,
            color: colors.text,
          }}>
          {user?.name == name ? 'Your posts' : name}
        </Text>
        <Pressable>
          <CaretLeft size={32} color={colors.background} />
        </Pressable>
      </View>
      <PostsList
        getBasePosts={getAllPostsFromAUser}
        posts={userPosts}
        isLoadingPosts={isLoadingPosts}
      />
    </SafeAreaView>
  );
}
