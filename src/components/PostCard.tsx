import {useNavigation} from '@react-navigation/native';
import {formatDistance} from 'date-fns';
import {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import defaultAvatarImg from '../assets/avatar.png';
import {FirebasePostsDatabase} from '../connection/Firebase/database';
import {useAuthContext} from '../hooks/useAuthContext';
import {PostsStackPrivateRoutesProps} from '../routes/private.stack.posts.routes';
import {colors, fonts} from '../theme/theme';
import {getPostDTO} from '../types/postDTO';

type PostProps = {
  postData: getPostDTO;
};

export function PostCard({postData}: PostProps) {
  const {user} = useAuthContext();
  const {navigate} = useNavigation<PostsStackPrivateRoutesProps>();
  const [usersWhoLiked, setUsersWhoLiked] = useState<string[]>(
    postData.usersWhoLiked,
  );

  if (!user?.uid) {
    return null;
  }
  const currentUserId = user.uid;
  const uid = postData.uid;

  const likedByCurrentUser = usersWhoLiked.includes(currentUserId)
    ? 'heart'
    : 'hearto';

  async function updateUsersWhoLikedAPost(id: string) {
    if (!usersWhoLiked.includes(currentUserId)) {
      setUsersWhoLiked(currentUsersWhoLiked => {
        const updatedUsersWhoLiked = [...currentUsersWhoLiked, currentUserId];
        FirebasePostsDatabase.UpdateLikes(id, updatedUsersWhoLiked);
        return updatedUsersWhoLiked;
      });
    } else {
      const usersWhoLikedWithoutTheCurrentUser = usersWhoLiked.filter(
        userId => {
          return userId !== currentUserId;
        },
      );
      setUsersWhoLiked(usersWhoLikedWithoutTheCurrentUser);
      FirebasePostsDatabase.UpdateLikes(id, usersWhoLikedWithoutTheCurrentUser);
    }
  }

  function dateFormatter(timeStamp: number) {
    const postDate = new Date(timeStamp);
    return formatDistance(new Date(), postDate, {
      /* Poderia aqui passar o Locale PT-BR, mas optei por deixar tudo em inglês*/
    });
  }

  return (
    <animatable.View
      style={{
        height: 230,
        marginBottom: 15,
        borderRadius: 5,
        padding: 15,
        backgroundColor: colors.info,
      }}
      animation="bounceInLeft">
      <TouchableOpacity
        onPress={() => {
          navigate('userposts', {uid, name: postData.authorName});
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.primary,
          borderRadius: 50,
          padding: 5,
        }}>
        <Image
          source={
            postData.avatarUrl ? {uri: postData.avatarUrl} : defaultAvatarImg
          }
          style={{width: 45, height: 45, borderRadius: 99}}
        />
        <Text
          style={{
            fontSize: 18,
            color: colors.text,
            fontFamily: fonts.regular,
          }}>
          {postData.authorName}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 18,
          height: 100,
          fontFamily: fonts.regular,
          color: colors.text,
          marginTop: 10,
          marginBottom: 10,
        }}>
        {postData.content}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {usersWhoLiked.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fonts.mono,
                fontSize: 25,
                marginRight: 5,
              }}>
              {usersWhoLiked.length}
            </Text>
            <TouchableOpacity
              onPress={() => {
                updateUsersWhoLikedAPost(postData.id);
              }}>
              <AntDesign
                name={likedByCurrentUser}
                size={25}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fonts.regular,
                fontSize: 16,
                marginRight: 5,
                marginBottom: 4,
              }}>
              Be the first to like{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                updateUsersWhoLikedAPost(postData.id);
              }}>
              <AntDesign
                name={likedByCurrentUser}
                size={25}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        )}
        <Text style={{fontSize: 17, color: colors.text, opacity: 0.7}}>
          {dateFormatter(postData.timeStamp)}
        </Text>
      </View>
    </animatable.View>
  );
}
