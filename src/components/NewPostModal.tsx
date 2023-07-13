import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../theme/theme';

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
        <View style={S.centeredView} />
      </TouchableWithoutFeedback>
      <View style={S.modalView}>
        <View style={S.modalHeader}>
          <Text />
          <View style={S.modalHeaderTitle}>
            <Text style={S.modalText}>Add a new post</Text>
            <Feather name="coffee" size={32} color={colors.text} />
          </View>
          <Pressable
            style={S.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={S.textStyle}>X</Text>
          </Pressable>
        </View>
        <TextInput
          textAlignVertical="top"
          multiline
          autoCorrect={false}
          maxLength={140}
          placeholder={postPlaceholder}
          style={S.input}
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
          <ActivityIndicator />
        ) : (
          <Pressable style={S.sendPostButton} onPress={handleAddPost}>
            <Text style={S.textStyle}>Post it up</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}

const S = StyleSheet.create({
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
  },
  input: {
    marginTop: 12,
    color: 'black',
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.info,

    height: 130,
    width: '100%',
  },
  modalView: {
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
  },

  buttonClose: {
    backgroundColor: colors.danger,
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 8,
  },
  textStyle: {
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  sendPostButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 15,
    elevation: 2,
  },

  modalText: {
    textAlign: 'center',
    fontSize: 20,
    color: colors.text,
    fontWeight: 'bold',
    marginLeft: 35,
    marginRight: 5,
    marginTop: 4,
  },
});
