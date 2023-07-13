import {StyleSheet, Text, View} from 'react-native';
import {useAuthContext} from '../hooks/useAuthContext';
import {colors, fonts} from '../theme/theme';

type MessageCardProps = {
  author: {
    name: string;
    uid: string;
  };
  timeStamp: number;
  content: string;
};
export function MessageCard({author, content, timeStamp}: MessageCardProps) {
  const {user} = useAuthContext();

  if (!user?.uid) {
    return;
  }

  return (
    <View
      style={[
        S.container,
        {
          backgroundColor:
            author.uid == 'system'
              ? colors.overlay
              : author.uid === user.uid
              ? colors.primary
              : colors.info,
        },
        {
          justifyContent:
            author.uid == 'system'
              ? 'center'
              : author.uid === user.uid
              ? 'flex-end'
              : 'flex-start',
        },
        author.uid === user.uid
          ? {
              borderRadius: 10,
              borderTopRightRadius: 0,
            }
          : author.uid === 'system'
          ? {
              borderRadius: 10,
            }
          : {borderRadius: 10, borderTopLeftRadius: 0},
        author.uid === user.uid
          ? {
              marginLeft: 50,
            }
          : author.uid === 'system'
          ? {}
          : {marginRight: 50},
      ]}>
      {author.name !== 'system' ? (
        author.name !== user.name ? (
          <Text
            style={{
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: 18,
            }}>
            {author.name}
          </Text>
        ) : null
      ) : null}
      <View
        style={{
          alignItems:
            author.name == user.name
              ? 'flex-end'
              : author.name == 'system'
              ? 'center'
              : 'flex-start',
        }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: 18,
          }}>
          {content}
        </Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
  },
});
