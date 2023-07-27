import {UsersThree} from 'phosphor-react-native';
import {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {FirebaseGroupsDatabase} from '../connection/Firebase/database';
import {useAuthContext} from '../hooks/useAuthContext';
import {useThemeContext} from '../hooks/useThemeContext';
import {Loading} from './Loading';

type NewGroupModalProps = {
  creatingNewGroup: boolean;
  modalVisible: boolean;
  handleCloseModal: () => void;
  addNewGroup: () => void;
  groupName: string;
  setGroupName: (value: string) => void;
};

export function NewGroupModal({
  modalVisible,
  handleCloseModal,
  addNewGroup,
  creatingNewGroup,
  groupName,
  setGroupName,
}: NewGroupModalProps) {
  const {user} = useAuthContext();
  const {colors, theme} = useThemeContext();

  const [contentIsEmpty, setContentIsEmpty] = useState(false);
  const [
    userAlreadyHaveThreeOrMoreGroups,
    setUserAlreadyHaveThreeOrMoreGroups,
  ] = useState(false);

  async function handleAddNewGroup() {
    if (!user?.uid) {
      return;
    }

    if (groupName == '') {
      setContentIsEmpty(true);
      return;
    }
    const res = await FirebaseGroupsDatabase.AmountOwnedByAUser(user.uid);
    if (res <= 3) {
      addNewGroup();
    } else {
      setUserAlreadyHaveThreeOrMoreGroups(true);
    }
  }

  useEffect(() => {
    if (groupName !== '') {
      setContentIsEmpty(false);
    }
  }, [groupName]);

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            alignItems: 'center',
          }}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          width: '95%',
          position: 'absolute',
          alignSelf: 'center',
          height: 210,
          marginTop: 80,
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          backgroundColor: colors.background,
          padding: 20,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.text,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: colors.text,
                fontWeight: 'bold',
                marginLeft: 35,
                marginRight: 5,
                marginTop: 4,
              }}>
              Create new group
            </Text>
            <UsersThree size={32} color={colors.text} />
          </View>
          <Pressable
            style={{
              backgroundColor: colors.danger,
              borderRadius: 5,
              padding: 2,
              paddingHorizontal: 8,
            }}
            onPress={handleCloseModal}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>X</Text>
          </Pressable>
        </View>
        <TextInput
          textAlignVertical="top"
          autoCorrect={false}
          maxLength={20}
          value={groupName}
          placeholder={'Group name'}
          style={{
            marginTop: 12,
            color: colors.text,
            paddingLeft: 10,
            backgroundColor: theme === 'dark' ? colors.info : colors.background,
            fontSize: 20,
            borderWidth: 1,
            borderRadius: 5,
            height: 50,
            width: '100%',
          }}
          placeholderTextColor={colors.text}
          onChangeText={value => {
            setGroupName(value);
          }}
        />
        <Text
          style={{
            color: colors.danger,
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}>
          {contentIsEmpty
            ? 'Groups must have a name'
            : userAlreadyHaveThreeOrMoreGroups
            ? "Users can't have more than three created groups"
            : ''}
        </Text>
        {creatingNewGroup ? (
          <Loading spinColor={colors.text} size={28} />
        ) : (
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: 5,
              padding: 5,
              paddingHorizontal: 15,
              elevation: 2,
            }}
            onPress={handleAddNewGroup}>
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20,
              }}>
              Create
            </Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}
