import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {MessageCard} from '../../components/MessageCard';
import {FirebaseMessagesDatabase} from '../../connection/Firebase/database';
import {useAuthContext} from '../../hooks/useAuthContext';
import {colors, fonts} from '../../theme/theme';
import {getMessageDTO} from '../../types/messageDTO';

type GroupChatRouteProps = {
  groupName: string;
  groupId: string;
};

export function GroupChat() {
  const {user} = useAuthContext();
  const {params} = useRoute();
  const {groupName, groupId} = params as GroupChatRouteProps;
  const {goBack} = useNavigation();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState<getMessageDTO[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sub = FirebaseMessagesDatabase.GetAll(groupId, setMessages);
    return () => sub();
  }, []);

  async function addMessageToAGroup() {
    if (!user?.name) {
      return;
    }
    if (message === '') {
      return;
    }
    try {
      setSendingMessage(true);
      const now = Date.now();
      await FirebaseMessagesDatabase.UpdateLast(groupId, message, now);
      await FirebaseMessagesDatabase.Add(
        groupId,
        user.name,
        user.uid,
        message,
        now,
      );
    } catch (error) {
      throw error;
    } finally {
      setMessage('');
      setSendingMessage(false);
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Animatable.View animation="fadeInDown" style={S.header}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={{
            alignItems: 'center',
          }}>
          <Feather name="chevron-left" size={32} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{color: colors.text, fontFamily: fonts.mono, fontSize: 20}}>
          {groupName}
        </Text>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Feather name="chevron-left" size={32} color={colors.background} />
        </View>
      </Animatable.View>
      <FlatList
        inverted
        data={messages}
        style={{flex: 1, padding: 18}}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <MessageCard
              author={item.author}
              timeStamp={item.timeStamp}
              content={item.content}
            />
          );
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{width: '100%'}}
        keyboardVerticalOffset={100}>
        <View
          style={{
            padding: 10,
            backgroundColor: colors.text,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
          }}>
          <TextInput
            autoCorrect={false}
            value={message}
            style={{
              fontFamily: fonts.regular,
              fontSize: 16,
              width: 270,
            }}
            multiline
            maxLength={80}
            onChangeText={value => {
              setMessage(value);
            }}
            placeholder="Enter your message here"
            placeholderTextColor={colors.info}
          />
          <TouchableOpacity
            disabled={sendingMessage}
            onPress={() => {
              addMessageToAGroup();
            }}
            style={{
              padding: 15,
              paddingTop: 18,
              paddingRight: 18,
              backgroundColor: colors.primary,
              borderRadius: 99,
            }}>
            {sendingMessage ? (
              <ActivityIndicator
                style={{paddingBottom: 3, paddingLeft: 3}}
                color={colors.text}
              />
            ) : (
              <Feather name="send" color={colors.text} size={22} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  header: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
