import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MagnifyingGlass, Pencil} from 'phosphor-react-native';
import {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import postsLogoDark from '../../assets/postsLogoDark.png';
import postsLogoLight from '../../assets/postsLogoLight.png';

import {NewPostModal} from '../../components/NewPostModal';
import {OpenModalWidget} from '../../components/OpenModalWidget';
import {PostsList} from '../../components/PostsList';
import {FirebasePostsDatabase} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {useThemeContext} from '../../hooks/useThemeContext';
import {PostsStackPrivateRoutesProps} from '../../routes/private.stack.posts.routes';
import {getPostDTO} from '../../types/postDTO';

export function Posts() {
  const {user} = useAuthContext();
  const {colors, fonts, theme} = useThemeContext();
  const {navigate} = useNavigation<PostsStackPrivateRoutesProps>();

  const [posts, setPosts] = useState<getPostDTO[]>([]);
  const [posting, setPosting] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postPlaceholder, setPostPlaceholder] = useState<string>('');
  const [postContent, setPostContent] = useState('');
  const [lastPost, setLastPost] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [modalVisible, setModalVisible] = useState(false);
  const [theresNoMorePosts, setTheresNoMorePosts] = useState(false);

  async function getNewerPostsFromAllUser() {
    if (theresNoMorePosts) {
      setIsLoadingPosts(false);
      Toast.show({
        type: 'info',
        text1: 'There is no more posts',
        position: 'bottom',
      });
      return;
    }
    if (isLoadingPosts) {
      return;
    }

    try {
      setIsLoadingPosts(true);
      if (lastPost) {
        const [newerPosts, theresNoMorePosts, lastPostFromNewer] =
          await FirebasePostsDatabase.GetNewer(lastPost);
        setPosts(currentPosts => [...currentPosts, ...newerPosts]);
        setLastPost(lastPostFromNewer);
        setTheresNoMorePosts(theresNoMorePosts);
        if (theresNoMorePosts) {
          setIsLoadingPosts(false);

          Toast.show({
            type: 'info',
            text1: 'There is no more posts',
            position: 'top',
          });
          return;
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function getOlderPostsFromAllUser() {
    try {
      setIsLoadingPosts(true);
      FirebasePostsDatabase.GetOlder().then(response => {
        const [olderPosts, theresNoMorePosts, lastPostFromOlder] = response;
        if (olderPosts !== undefined) {
          setPosts(olderPosts);
          setLastPost(lastPostFromOlder);
          setTheresNoMorePosts(theresNoMorePosts);
        }
      });
    } catch (error) {
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function addPost() {
    try {
      setPosting(true);
      if (user?.uid) {
        await FirebasePostsDatabase.Add(postContent, user);
        setPostContent('');
      }
    } catch (error) {
    } finally {
      setPosting(false);
      setModalVisible(false);
      setTheresNoMorePosts(false);
      setIsLoadingPosts(false);
      setPostContent('');
      if (lastPost) {
        getNewerPostsFromAllUser();
      } else {
        getOlderPostsFromAllUser();
      }
    }
  }

  function setRandomPlaceholder() {
    const placeholderPhrases: string[] = [
      'Share your thoughts.',
      "Tell us what's new.",
      'Got something to say?',
      'Share your story.',
      'Write it down!',
      "What's on your mind?",
      'Got news to share?',
      'Express yourself!',
      'Speak your mind.',
      'Write away!',
    ];
    const random = Math.floor(Math.random() * placeholderPhrases.length);
    setPostPlaceholder(placeholderPhrases[random]);
  }

  useFocusEffect(
    useCallback(() => {
      let componentIsMounted = true;

      if (componentIsMounted) {
        getOlderPostsFromAllUser();
        setRandomPlaceholder();
      }

      return () => {
        componentIsMounted = false;
      };
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        padding: 15,
        paddingTop: 5,
        backgroundColor: colors.background,
      }}>
      <Animatable.View
        animation="fadeInDown"
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image source={theme === 'dark' ? postsLogoDark : postsLogoLight} />
        <TouchableOpacity
          onPress={() => {
            navigate('searchPosts');
          }}
          style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontFamily: theme === 'dark' ? fonts.mono : fonts.medium,
            }}>
            Search
          </Text>
          <MagnifyingGlass color={colors.text} size={22} />
        </TouchableOpacity>
      </Animatable.View>
      <PostsList
        getNewPosts={getNewerPostsFromAllUser}
        getBasePosts={FirebasePostsDatabase.GetOlder}
        isLoadingPosts={isLoadingPosts}
        posts={posts}
      />
      <NewPostModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        postPlaceholder={postPlaceholder}
        posting={posting}
        postContent={postContent}
        setPostContent={setPostContent}
        addPost={addPost}
      />
      <OpenModalWidget
        Icon={<Pencil color={colors.background} size={25} />}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
