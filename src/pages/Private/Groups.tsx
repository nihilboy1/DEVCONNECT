import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import devGroupLogoDark from '../../assets/devGroupLogoDark.png';
import {GroupCard} from '../../components/GroupCard';
import {NewGroupModal} from '../../components/NewGroupModal';
import {OpenModalWidget} from '../../components/OpenModalWidget';
import {
  FirebaseGroupsDatabase,
  FirebaseMessagesDatabase,
} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {colors, fonts} from '../../theme/theme';
import {getGroupDTO} from '../../types/groupDTO';
import {addMessageDTO} from '../../types/messageDTO';

export function Groups() {
  const {user} = useAuthContext();
  const [creatingNewGroup, setCreatingNewGroup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<getGroupDTO[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [theresNoMoreGroups, setTheresNoMoreGroups] = useState(false);

  async function handleCloseModal() {
    setModalVisible(!modalVisible);
    setGroupName('');
  }

  async function addNewGroup() {
    if (!user?.uid) {
      return;
    }
    try {
      setCreatingNewGroup(true);
      const defaultMessage = {
        content: `${groupName} group was created. Welcome!`,
        timeStamp: Date.now(),
        author: {
          name: 'system',
          uid: 'system',
        },
        id: 'system',
      } as addMessageDTO;
      const res = await FirebaseGroupsDatabase.Add({
        groupName: groupName,
        groupOwnerId: user.uid,
        lastMessage: defaultMessage,
        timeStamp: Date.now(),
      });
      await FirebaseMessagesDatabase.AddDefault(res, defaultMessage);
    } catch (error) {
    } finally {
      setCreatingNewGroup(false);
      setTheresNoMoreGroups(false);
      handleCloseModal();
    }
  }

  async function handleFirebaseGetAllGroupsFromAllUsers() {
    if (theresNoMoreGroups) {
      setLoadingGroups(false);
      Toast.show({
        type: 'info',
        text1: 'All groups was loaded',
        position: 'bottom',
      });
      return;
    }
    if (loadingGroups) {
      return;
    }
    try {
      setLoadingGroups(true);
      const response = await FirebaseGroupsDatabase.GetAll();
      if (response) {
        setGroups(response);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingGroups(false);
      setTheresNoMoreGroups(true);
    }
  }

  async function handleFireBaseDeleteAGroup(
    groupOwnerId: string,
    groupId: string,
  ) {
    if (groupOwnerId !== user?.uid) {
      return;
    }

    Alert.alert('Warning!', 'Do you really want to delete this group?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete Group',
        onPress: async () => {
          try {
            setLoadingGroups(true);
            await FirebaseGroupsDatabase.Delete(groupId);
          } catch (error) {
            throw error;
          } finally {
            setLoadingGroups(false);
            setTheresNoMoreGroups(false);
          }
        },
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      handleFirebaseGetAllGroupsFromAllUsers();
    }, [theresNoMoreGroups]),
  );

  return (
    <View style={S.container}>
      <Animatable.View animation="fadeInDown" style={S.header}>
        <Image source={devGroupLogoDark} />
        <TouchableOpacity
          onPress={() => {}}
          style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <Text style={S.moveToText}>Search</Text>
          <Feather name="search" color={colors.text} size={22} />
        </TouchableOpacity>
      </Animatable.View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={groups}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <GroupCard
              groupName={item.groupName}
              lastMessageContent={item.lastMessage.content}
              handleFireBaseDeleteAGroup={handleFireBaseDeleteAGroup}
              groupOwnerId={item.groupOwnerId}
              groupId={item.id}
            />
          );
        }}
      />
      <OpenModalWidget iconName="plus" setModalVisible={setModalVisible} />
      <NewGroupModal
        setGroupName={setGroupName}
        groupName={groupName}
        handleCloseModal={handleCloseModal}
        modalVisible={modalVisible}
        creatingNewGroup={creatingNewGroup}
        addNewGroup={addNewGroup}
      />
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 15,
    paddingTop: 5,
    backgroundColor: colors.background,
  },

  header: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  moveToText: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.mono,
  },
});
