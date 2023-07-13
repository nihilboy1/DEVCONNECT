import {useNavigation} from '@react-navigation/native';
import {Text, TouchableOpacity} from 'react-native';
import {useAuthContext} from '../hooks/useAuthContext';
import {GroupsStackPrivateRoutesProps} from '../routes/private.stack.groups.routes';
import {colors, fonts} from '../theme/theme';

type GroupCardProps = {
  groupName: string;
  lastMessageContent: string;
  groupOwnerId: string;
  groupId: string;
  handleFireBaseDeleteAGroup: (value1: string, value2: string) => void;
};

export function GroupCard({
  groupName,
  groupOwnerId,
  groupId,
  lastMessageContent,
  handleFireBaseDeleteAGroup,
}: GroupCardProps) {
  const {user} = useAuthContext();
  const {navigate} = useNavigation<GroupsStackPrivateRoutesProps>();
  return (
    <TouchableOpacity
      onLongPress={() => {
        handleFireBaseDeleteAGroup(groupOwnerId, groupId);
      }}
      onPress={() => {
        navigate('groupChat', {groupName, groupId});
      }}
      style={{
        borderWidth: 1,
        backgroundColor:
          user?.uid === groupOwnerId ? colors.primary : colors.info,
        padding: 18,
        borderRadius: 5,
        marginBottom: 10,
      }}>
      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.medium,
          fontSize: 18,
          textDecorationLine: 'underline',
          lineHeight: 18,
          letterSpacing: 3,
        }}>
        {groupName}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          color: colors.text,
          fontFamily: fonts.regular,
          fontSize: 14,
          marginTop: 5,
        }}>
        {lastMessageContent}
      </Text>
    </TouchableOpacity>
  );
}
