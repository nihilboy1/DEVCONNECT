import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import defaultAvatarImg from '../../assets/avatar.png';
import {Loading} from '../../components/Loading';
import {AsyncStorageUser} from '../../connection/AsyncStorage/userStorage';
import {
  FirebasePostsDatabase,
  FirebaseUsersDatabase,
} from '../../connection/Firebase/database';
import {FirebaseUsersAvatarStorage} from '../../connection/Firebase/storage';
import {useAuthContext} from '../../hooks/useAuthContext';
import {colors} from '../../theme/theme';
import {userDTO} from '../../types/userDTO';

export function Profile() {
  const {signOut, user, setUser} = useAuthContext();
  if (!user?.uid) {
    return;
  }
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [updatingUserName, setUpdatingUserName] = useState(false);
  const [updatingUserAvatarUrl, setUpdatingUserAvatarUrl] = useState(false);
  const [oldName, setOldName] = useState(user.name);
  const [currentName, setCurrentName] = useState<string>(user.name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);

  async function updateUserName() {
    try {
      setUpdatingUserName(true);
      if (!user?.uid) {
        return;
      }
      await FirebaseUsersDatabase.Update(
        {name: currentName, nameInsensitive: currentName.toUpperCase()},
        user.uid,
      );
      const response = await FirebaseUsersDatabase.Get(user.uid);
      if (response !== undefined) {
        const user = {
          uid: response.uid,
          name: response.name,
          nameInsensitive: response.nameInsensitive,
          email: response.email,
          avatarUrl: response.avatarUrl,
          timeStamp: response.timeStamp,
        } as userDTO;
        await AsyncStorageUser.Set(user);
        setUser(user);
        setCurrentName(user.name);
        setOldName(user.name);
        await FirebasePostsDatabase.UpdateAllFromAUser(
          {authorName: user.name},
          user.uid,
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setUpdatingUserName(false);
      setDisabledButton(true);
    }
  }

  async function updateUserAvatarUrl() {
    try {
      setUpdatingUserAvatarUrl(true);
      if (!user?.uid) {
        return;
      }
      const res = await launchImageLibrary({mediaType: 'photo'});
      if (res.didCancel) {
        return;
      } else if (res.errorCode) {
        return;
      } else if (res.assets) {
        const filePath = res.assets[0].uri;
        if (filePath) {
          await FirebaseUsersAvatarStorage.Upload(filePath, user.uid);
          const avatarUri = await FirebaseUsersAvatarStorage.Download(user.uid);
          await FirebaseUsersDatabase.Update({avatarUrl: avatarUri}, user.uid);
          const response = await FirebaseUsersDatabase.Get(user.uid);
          if (response !== undefined) {
            const user = {
              uid: response.uid,
              name: response.name,
              nameInsensitive: response.nameInsensitive,
              email: response.email,
              avatarUrl: response.avatarUrl,
              timeStamp: response.timeStamp,
            } as userDTO;
            await AsyncStorageUser.Set(user);
            setUser(user);
            setAvatarUrl(user.avatarUrl);
            await FirebasePostsDatabase.UpdateAllFromAUser(
              {avatarUrl: user.avatarUrl},
              user.uid,
            );
          }
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setUpdatingUserAvatarUrl(false);
    }
  }

  async function removeUserAvatarUrl() {
    try {
      setUpdatingUserAvatarUrl(true);
      if (!user?.uid) {
        return;
      }
      await FirebaseUsersAvatarStorage.Delete(user.uid);
      await FirebasePostsDatabase.UpdateAllFromAUser(
        {avatarUrl: null},
        user.uid,
      );
      await FirebaseUsersDatabase.Update({avatarUrl: null}, user.uid);
      const response = await FirebaseUsersDatabase.Get(user.uid);
      if (response !== undefined) {
        const user = {
          uid: response.uid,
          name: response.name,
          nameInsensitive: response.nameInsensitive,
          email: response.email,
          avatarUrl: response.avatarUrl,
          timeStamp: response.timeStamp,
        } as userDTO;
        await AsyncStorageUser.Set(user);
        setUser(user);
        setAvatarUrl(user.avatarUrl);
      }
    } catch (error) {
    } finally {
      setUpdatingUserAvatarUrl(false);
    }
  }

  useEffect(() => {
    if (currentName === '' || currentName === oldName) {
      setDisabledButton(true);
    } else {
      setDisabledButton(false);
    }
  }, [currentName]);

  useFocusEffect(
    useCallback(() => {
      setCurrentName(user.name);
    }, [user]),
  );

  const handleKeyboardHide = () => {
    setKeyboardVisible(false);
  };

  const handleKeyboardShow = () => {
    setKeyboardVisible(true);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={S.container}>
      <Text style={S.userEmailText}>{user.email}</Text>
      {isKeyboardVisible ? null : (
        <View
          style={[
            S.uploadAvatarView,
            !avatarUrl ? {} : {borderTopRightRadius: 5},
          ]}>
          {avatarUrl ? (
            <>
              <TouchableOpacity
                onPress={updateUserAvatarUrl}
                style={S.uploadAvatarIconBox1}>
                <Feather name="edit" size={28} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={S.uploadAvatarIconBox2}
                onPress={removeUserAvatarUrl}>
                <Feather name="x" size={28} color={colors.text} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={updateUserAvatarUrl}
              style={S.uploadAvatarIconBox1}>
              <Feather name="file-plus" size={28} color={colors.text} />
            </TouchableOpacity>
          )}
          {updatingUserAvatarUrl ? (
            <View style={{padding: 50}}>
              <Loading spinColor={colors.text} size={50} />
            </View>
          ) : (
            <Image
              source={!avatarUrl ? defaultAvatarImg : {uri: avatarUrl}}
              style={[
                S.avatarImage,
                !avatarUrl ? {} : {borderColor: colors.primary},
              ]}
            />
          )}
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: colors.primary,
          padding: 5,
          marginTop: 35,
        }}>
        <TextInput
          style={S.userNameText}
          maxLength={15}
          value={currentName}
          onChangeText={value => {
            setCurrentName(value);
          }}
        />
        <TouchableOpacity
          disabled={disabledButton}
          onPress={updateUserName}
          style={{
            backgroundColor: colors.primary,
            padding: 4,
            borderRadius: 10,
            opacity: disabledButton ? 0.2 : 1,
          }}>
          {updatingUserName ? (
            <Loading spinColor={colors.text} size={28} />
          ) : (
            <Feather name="save" size={28} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
      {isKeyboardVisible ? null : (
        <TouchableOpacity style={S.signOutButton} onPress={signOut}>
          <Text style={S.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const S = StyleSheet.create({
  signOutButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    padding: 12,
    marginTop: 100,
  },

  uploadAvatarIconBox1: {
    position: 'absolute',
    left: 20,
    bottom: 25,
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 10,
    marginLeft: 5,
    marginTop: 5,
    zIndex: 99,
  },

  uploadAvatarIconBox2: {
    position: 'absolute',
    right: 20,
    top: 25,
    backgroundColor: colors.danger,
    padding: 4,
    borderRadius: 10,
    marginLeft: 5,
    marginTop: 5,
    zIndex: 99,
  },

  uploadAvatarView: {
    padding: 25,
    position: 'relative',
    marginTop: 25,
  },

  updateProfileButton: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    padding: 12,
    marginTop: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  userNameText: {
    fontSize: 30,
    color: colors.text,
    backgroundColor: colors.info,
    height: 50,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
  },
  userEmailText: {
    fontSize: 22,
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 40,
  },
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  avatarImage: {
    borderRadius: 100,
    width: 150,
    height: 150,
    borderWidth: 3,
  },
});
