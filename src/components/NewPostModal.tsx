import {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../theme/theme';
import {Loading} from './Loading';

type NewPostModalProps = {
  modalVisible: boolean;
  postContent: string;
  posting: boolean;
  postPlaceholder: string;
  addPost: () => void;
  setModalVisible: (value: boolean) => void;
  setPostContent: (value: string) => void;
};

export function NewPostModal({
  modalVisible,
  postContent,
  setModalVisible,
  setPostContent,
  addPost,
  postPlaceholder,
  posting,
}: NewPostModalProps) {
  const [contentIsEmpty, setContentIsEmpty] = useState(false);
  function handleAddPost() {
    if (postContent === '') {
      setContentIsEmpty(true);
      return;
    }
    addPost();
  }

  useEffect(() => {
    if (postContent !== '') {
      setContentIsEmpty(false);
    }
  }, [postContent]);

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(false);
        }}>
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
          height: 290,
          marginTop: 70,
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
              Add a new post
            </Text>
            <Feather name="coffee" size={32} color={colors.text} />
          </View>
          <Pressable
            style={{
              backgroundColor: colors.danger,
              borderRadius: 5,
              padding: 2,
              paddingHorizontal: 8,
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>X</Text>
          </Pressable>
        </View>
        <TextInput
          textAlignVertical="top"
          multiline
          autoCorrect={false}
          maxLength={140}
          placeholder={postPlaceholder}
          style={{
            marginTop: 12,
            color: colors.text,
            fontSize: 20,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: colors.info,
            height: 130,
            width: '100%',
          }}
          placeholderTextColor={colors.text}
          onChangeText={value => {
            setPostContent(value);
          }}
        />
        <Text
          style={{
            color: colors.danger,
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}>
          {contentIsEmpty ? "The post content can't be empty" : ''}
        </Text>
        {posting ? (
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
            onPress={handleAddPost}>
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20,
              }}>
              Post it up
            </Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}
