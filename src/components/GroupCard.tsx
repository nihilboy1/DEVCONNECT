import {useNavigation} from '@react-navigation/native';
import {Text, TouchableOpacity} from 'react-native';
import {useAuthContext} from '../hooks/useAuthContext';
import {useThemeContext} from '../hooks/useThemeContext';
import {GroupsStackPrivateRoutesProps} from '../routes/private.stack.groups.routes';

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
  const {colors, fonts} = useThemeContext();

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
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 5,
        marginBottom: 10,
        borderRightWidth: 10,
        borderRightColor:
          user?.uid !== groupOwnerId ? colors.primary : colors.info,
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
