import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {PostsList} from '../../components/PostsList';
import {FirebasePostsDatabase} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {userPostsRouteProps} from '../../routes/private.stack.posts.routes';
import {colors} from '../../theme/theme';
import {getPostDTO} from '../../types/postDTO';

export function UserPosts() {
  const {user} = useAuthContext();
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
    <SafeAreaView style={S.safeContainer}>
      <View style={S.innerContainer}>
        <Pressable style={S.buttonBack} onPress={() => goBack()}>
          <Feather name="chevron-left" size={32} color={colors.text} />
        </Pressable>
        <Text style={S.postsAuthor}>
          {user?.name == name ? 'Seus Posts' : name}
        </Text>
        <Pressable>
          <Feather name="chevron-left" size={32} color={colors.background} />
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

const S = StyleSheet.create({
  safeContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonBack: {
    backgroundColor: colors.info,
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 8,
    paddingRight: 10,
  },

  goBackButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 30,
    borderRadius: 99,
  },

  postsAuthor: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 5,
    marginBottom: 10,
    color: colors.text,
  },
});
