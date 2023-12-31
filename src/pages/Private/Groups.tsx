import {useFocusEffect} from '@react-navigation/native';
import {Plus} from 'phosphor-react-native';
import {useCallback, useState} from 'react';
import {Alert, FlatList, Image, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import groupsLogoDark from '../../assets/groupsLogoDark.png';
import groupsLogoLight from '../../assets/groupsLogoLight.png';
import {GroupCard} from '../../components/GroupCard';
import {NewGroupModal} from '../../components/NewGroupModal';
import {OpenModalWidget} from '../../components/OpenModalWidget';
import {
  FirebaseGroupsDatabase,
  FirebaseMessagesDatabase,
} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {useThemeContext} from '../../hooks/useThemeContext';
import {getGroupDTO} from '../../types/groupDTO';
import {addMessageDTO} from '../../types/messageDTO';

export function Groups() {
  const {user} = useAuthContext();
  const {colors, theme} = useThemeContext();

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

  async function getAllGroups() {
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

  async function deleteAGroup(groupOwnerId: string, groupId: string) {
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
      let componentIsMounted = true;
      if (componentIsMounted) {
        getAllGroups();
      }

      return () => {
        componentIsMounted = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let componentIsMounted = true;

      getAllGroups();

      return () => {
        componentIsMounted = false;
      };
    }, [theresNoMoreGroups]),
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
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={theme === 'dark' ? groupsLogoDark : groupsLogoLight} />
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
              handleFireBaseDeleteAGroup={deleteAGroup}
              groupOwnerId={item.groupOwnerId}
              groupId={item.id}
            />
          );
        }}
      />
      <OpenModalWidget
        Icon={<Plus color={colors.background} size={25} />}
        setModalVisible={setModalVisible}
      />
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
