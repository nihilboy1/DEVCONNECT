import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {AuthInput} from '../../components/AuthInput';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header';
import {useAuthContext} from '../../hooks/useAuthContext';
import {StackAuthRoutesProps} from '../../routes/auth.routes';
import {colors, fonts} from '../../theme/theme';
import {showToast} from '../../utils/toastConfig';

export function SignIn() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {navigate} = useNavigation<StackAuthRoutesProps>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {signIn, isAuthLoading} = useAuthContext();

  function moveToSignUp() {
    navigate('signUp');
  }

  async function handleSignIn() {
    if (email === '' || password === '') {
      showToast('error', 'top', 'There are empty fields');
      return;
    }
    await signIn(email, password);
  }

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
      contentContainerStyle={[S.container, {gap: isKeyboardVisible ? 20 : 50}]}>
      {!isKeyboardVisible && (
        <Header moveButton={moveToSignUp} moveButtonText="Create account" />
      )}
      <Animatable.Text animation="fadeInLeft" style={S.pageTitle}>
        Sign In
      </Animatable.Text>
      <AuthInput
        label="Email"
        onChangeText={(value: string) => {
          setEmail(value);
        }}
        value={email}
        keyboardType="email-address"
      />
      <AuthInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={(value: string) => {
          setPassword(value);
        }}
      />

      <Button
        action={handleSignIn}
        isLoading={isAuthLoading}
        content="Sign In"
      />
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

  moveToSignUp: {
    color: colors.text,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.mono,
  },

  header: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
