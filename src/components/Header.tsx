import {Image, Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import mainLogoDark from '../assets/mainLogoDark.png';
import {colors, fonts} from '../theme/theme';

type HeaderProps = {
  moveButton: () => void;
  moveButtonText: string;
};

export function Header({moveButton, moveButtonText}: HeaderProps) {
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
      <Image source={mainLogoDark} />
      <TouchableOpacity onPress={moveButton}>
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            textAlign: 'center',
            fontFamily: fonts.mono,
          }}>
          {moveButtonText}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
