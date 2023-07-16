import {Image, Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import mainLogoDark from '../assets/mainLogoDark.png';
import mainLogoLight from '../assets/mainLogoLight.png';

import {useThemeContext} from '../hooks/useThemeContext';

type HeaderProps = {
  moveButton: () => void;
  moveButtonText: string;
};

export function Header({moveButton, moveButtonText}: HeaderProps) {
  const {colors, fonts, theme} = useThemeContext();

  return (
    <Animatable.View
      animation="fadeInDown"
      style={{
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Image source={theme === 'dark' ? mainLogoDark : mainLogoLight} />
      <TouchableOpacity onPress={moveButton}>
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            textAlign: 'center',
            fontFamily: fonts.medium,
          }}>
          {moveButtonText}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
