import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import mainLogoDark from '../../assets/mainLogoDark.png';

import {useAuthContext} from '../../hooks/useAuthContext';
import {StackAuthRoutesProps} from '../../routes/auth.routes';
import {colors, fonts} from '../../theme/theme';
import {showToast} from '../../utils/toastConfig';

export function SignUp() {
  const {goBack} = useNavigation<StackAuthRoutesProps>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {signUp, isAuthLoading} = useAuthContext();

  const handleKeyboardHide = () => {
    setKeyboardVisible(false);
  };

  const handleKeyboardShow = () => {
    setKeyboardVisible(true);
  };

  async function handleSignUp() {
    if (email === '' || password === '' || name === '') {
      showToast('info', 'top', 'There are empty fields');
      return;
    }
    await signUp(email, password, name);
  }

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
      contentContainerStyle={[S.container, {gap: isKeyboardVisible ? 20 : 50}]}>
      {!isKeyboardVisible && (
        <Animatable.View animation="fadeInDown" style={S.header}>
          <Image source={mainLogoDark} />
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}>
            <Text style={S.moveToLogin}>Sign In</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
      <Animatable.Text animation="fadeInLeft" style={S.pageTitle}>
        Sign Up
      </Animatable.Text>
      <Animatable.View animation="fadeInLeft" style={S.inputBox}>
        <Text style={S.inputLabelText}>Email</Text>
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={value => {
            setEmail(value);
          }}
          style={S.textInput}
        />
      </Animatable.View>
      <Animatable.View animation="fadeInLeft" style={S.inputBox}>
        <Text style={S.inputLabelText}>Name</Text>
        <TextInput
          value={name}
          onChangeText={value => {
            setName(value);
          }}
          style={S.textInput}
        />
      </Animatable.View>
      <Animatable.View animation="fadeInLeft" style={S.inputBox}>
        <Text style={S.inputLabelText}>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={value => {
            setPassword(value);
          }}
          style={S.textInput}
        />
      </Animatable.View>

      <View>
        {isAuthLoading ? (
          <TouchableOpacity
            style={S.signUpButton}
            onPress={handleSignUp}
            disabled>
            <ActivityIndicator color={colors.background} size={38} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={S.signUpButton} onPress={handleSignUp}>
            <Text style={S.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    padding: 10,
  },

  pageTitle: {
    alignSelf: 'flex-start',
    color: colors.text,
    fontFamily: fonts.medium,
    marginLeft: 2,
    fontSize: 25,
  },
  inputBox: {
    width: '100%',
  },

  inputLabelText: {
    marginLeft: 3,
    color: colors.info,
    marginBottom: -5,
  },

  textInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    fontFamily: fonts.regular,
    borderBottomColor: colors.info,
    color: colors.text,
    borderBottomRightRadius: 25,
    paddingBottom: 5,
  },

  signUpButton: {
    borderRadius: 15,
    height: 60,
    padding: 10,
    width: 320,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: colors.text,
    borderColor: colors.background,
  },

  moveToLogin: {
    color: colors.text,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.mono,
  },

  signUpButtonText: {
    color: colors.background,
    fontFamily: fonts.regular,
    fontSize: 24,
    textAlign: 'center',
  },

  header: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
