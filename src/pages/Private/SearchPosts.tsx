import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import devPostLogoDark from '../../assets/devPostLogoDark.png';

import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import {FirebaseUsersDatabase} from '../../connection/Firebase/database';
import {PostsStackPrivateRoutesProps} from '../../routes/private.stack.posts.routes';
import {colors, fonts} from '../../theme/theme';
import {userDTO} from '../../types/userDTO';

export function SearchPosts() {
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
    <View style={S.container}>
      <Animatable.View animation="fadeInDown" style={S.header}>
        <Pressable style={S.buttonBack} onPress={() => goBack()}>
          <Feather name="chevron-left" size={32} color={colors.text} />
        </Pressable>
        <Image source={devPostLogoDark} />

        <Feather name="chevron-left" size={32} color={colors.background} />
      </Animatable.View>
      <View style={S.searchContainer}>
        <Feather name="search" size={32} color={colors.black} />
        <TextInput
          placeholder="Search for people"
          placeholderTextColor={colors.text}
          style={S.inputText}
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
              style={S.userSearchedButton}
              onPress={() => {
                navigate('userposts', {name: item.name, uid: item.uid});
              }}>
              <Text style={S.userSearchedButtonText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const S = StyleSheet.create({
  userSearchedButton: {
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: colors.info,
    borderRadius: 5,
    justifyContent: 'center',
  },

  buttonBack: {
    backgroundColor: colors.info,
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 8,
    paddingRight: 10,
  },

  header: {
    width: '100%',
    padding: 10,
    paddingTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userSearchedButtonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: colors.background,
    padding: 15,
    flex: 1,
    borderWidth: 1,
  },
  searchContainer: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
    fontFamily: fonts.regular,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },

  inputText: {
    fontSize: 18,
    color: colors.text,
    marginLeft: 10,
  },
});
