import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  Switch,
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
import {useThemeContext} from '../../hooks/useThemeContext';
import {userDTO} from '../../types/userDTO';

export function Profile() {
  const {signOut, user, setUser} = useAuthContext();
  const {colors, fonts, theme, setTheme} = useThemeContext();

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
  function handleChangeTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    }
  }
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
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
      }}>
      <View
        style={{
          marginTop: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: colors.text, fontFamily: fonts.bold}}>
          {theme === 'dark' ? 'DARKMODE' : 'LIGHTMODE'}
        </Text>
        <Switch
          trackColor={{false: colors.primary, true: colors.primary}}
          thumbColor={colors.text}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleChangeTheme}
          value={theme === 'dark' ? false : true}
        />
      </View>
      <View
        style={[
          {
            padding: 25,
            position: 'relative',
          },
          !avatarUrl ? {} : {borderTopRightRadius: 5},
        ]}>
        {avatarUrl ? (
          <>
            <TouchableOpacity
              onPress={updateUserAvatarUrl}
              style={{
                position: 'absolute',
                left: 20,
                bottom: 25,
                backgroundColor: colors.primary,
                padding: 4,
                borderRadius: 10,
                marginLeft: 5,
                zIndex: 99,
              }}>
              <Feather name="edit" size={28} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
                top: 25,
                backgroundColor: colors.danger,
                padding: 4,
                borderRadius: 10,
                marginLeft: 5,
                marginTop: 5,
                zIndex: 99,
              }}
              onPress={removeUserAvatarUrl}>
              <Feather name="x" size={28} color={colors.text} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={updateUserAvatarUrl}
            style={{
              position: 'absolute',
              left: 20,
              bottom: 25,
              backgroundColor: colors.primary,
              padding: 4,
              borderRadius: 10,
              marginLeft: 5,
              marginTop: 5,
              zIndex: 99,
            }}>
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
              {
                borderRadius: 100,
                width: 150,
                height: 150,
                borderWidth: 3,
              },
              !avatarUrl ? {} : {borderColor: colors.info},
            ]}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: colors.info,
          padding: 5,
          marginTop: 35,
        }}>
        <TextInput
          style={{
            fontSize: 25,
            color: colors.text,
            fontFamily: fonts.regular,
            borderWidth: 1,
            borderColor: colors.info,
            backgroundColor: theme === 'dark' ? colors.info : colors.background,
            height: 50,
            borderRadius: 5,
            padding: 5,
            paddingHorizontal: 20,
          }}
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
      <Text
        style={{
          fontSize: 22,
          color: colors.text,
          fontStyle: 'italic',
          marginTop: isKeyboardVisible ? 5 : 15,
        }}>
        {user.email}
      </Text>
      {isKeyboardVisible ? null : (
        <TouchableOpacity
          style={{
            backgroundColor: colors.danger,
            borderRadius: 10,
            padding: 12,
            marginTop: 50,
          }}
          onPress={signOut}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.text,
            }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
