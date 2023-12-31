import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {AuthInput} from '../../components/AuthInput';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header';
import {useAuthContext} from '../../hooks/useAuthContext';
import {useThemeContext} from '../../hooks/useThemeContext';
import {StackAuthRoutesProps} from '../../routes/auth.routes';
import {showToast} from '../../utils/toastConfig';

export function SignIn() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {navigate} = useNavigation<StackAuthRoutesProps>();
  const {colors, fonts} = useThemeContext();
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
      contentContainerStyle={[
        {
          alignItems: 'center',
          backgroundColor: colors.background,
          flex: 1,
          padding: 10,
        },
        {gap: isKeyboardVisible ? 20 : 50},
      ]}>
      {!isKeyboardVisible && (
        <Header moveButton={moveToSignUp} moveButtonText="Create account" />
      )}
      <Animatable.Text
        animation="fadeInLeft"
        style={{
          alignSelf: 'flex-start',
          color: colors.text,
          fontFamily: fonts.medium,
          marginLeft: 2,
          fontSize: 25,
        }}>
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
