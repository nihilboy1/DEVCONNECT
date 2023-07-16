import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Button} from '../../components/Button';

import {AuthInput} from '../../components/AuthInput';
import {Header} from '../../components/Header';
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
        <Header moveButton={goBack} moveButtonText="Login" />
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
        Sign Up
      </Animatable.Text>
      <AuthInput
        label="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={value => {
          setEmail(value);
        }}
      />
      <AuthInput
        label="Name"
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <AuthInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={value => {
          setPassword(value);
        }}
      />

      <Button
        action={handleSignUp}
        isLoading={isAuthLoading}
        content="Sign Up"
      />
    </ScrollView>
  );
}
