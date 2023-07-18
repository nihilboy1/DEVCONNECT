import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import mainLogoDark from '../../assets/mainLogoDark.png';
import mainLogoLight from '../../assets/mainLogoLight.png';

import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import {FirebaseUsersDatabase} from '../../connection/Firebase/database';
import {useThemeContext} from '../../hooks/useThemeContext';
import {PostsStackPrivateRoutesProps} from '../../routes/private.stack.posts.routes';
import {userDTO} from '../../types/userDTO';

export function SearchPosts() {
  const {colors, theme} = useThemeContext();

  const {navigate, goBack} = useNavigation<PostsStackPrivateRoutesProps>();
  const [userName, setUserName] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<userDTO[]>([]);

  useEffect(() => {
    if (userName === '' || userName === undefined) {
      setSearchedUsers([]);
      return;
    }
    const sub = FirebaseUsersDatabase.GetByName(userName, setSearchedUsers);
    return () => sub();
  }, [userName]);

  useFocusEffect(
    useCallback(() => {
      setUserName('');
      setSearchedUsers([]);
    }, []),
  );
  return (
    <View
      style={{
        backgroundColor: colors.background,
        padding: 15,
        flex: 1,
        borderWidth: 1,
      }}>
      <Animatable.View
        animation="fadeInDown"
        style={{
          width: '100%',
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: colors.info,
            borderRadius: 5,
            padding: 2,
            paddingHorizontal: 8,
            paddingRight: 10,
            marginTop: 5,
          }}
          onPress={() => goBack()}>
          <Feather
            name="chevron-left"
            size={32}
            color={theme === 'dark' ? colors.text : colors.background}
          />
        </Pressable>
        <Image source={theme === 'dark' ? mainLogoDark : mainLogoLight} />
        <Feather name="chevron-left" size={32} color={colors.background} />
      </Animatable.View>
      <View
        style={{
          borderWidth: 1,
          padding: 8,
          borderRadius: 10,
          backgroundColor: colors.primary,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 15,
        }}>
        <Feather name="search" size={32} color={colors.background} />
        <TextInput
          placeholder="Search for people"
          placeholderTextColor={colors.text}
          style={{
            fontSize: 18,
            color: colors.text,
            marginLeft: 10,
          }}
          onChangeText={value => {
            setUserName(value);
          }}
          value={userName}
        />
      </View>
      <FlatList
        data={searchedUsers}
        keyExtractor={item => item.uid}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{
                padding: 10,
                borderWidth: 1,
                marginTop: 10,
                backgroundColor: colors.info,
                borderRadius: 5,
                justifyContent: 'center',
              }}
              onPress={() => {
                navigate('userposts', {name: item.name, uid: item.uid});
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme === 'dark' ? colors.text : colors.background,
                  fontWeight: 'bold',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
