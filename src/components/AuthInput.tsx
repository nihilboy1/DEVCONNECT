import {Text, TextInput, TextInputProps} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {colors, fonts} from '../theme/theme';

type AuthPageInputProps = TextInputProps & {
  label: string;
};

export function AuthInput({label, ...inputProps}: AuthPageInputProps) {
  return (
    <Animatable.View
      animation="fadeInLeft"
      style={{
        width: '100%',
      }}>
      <Text
        style={{
          marginLeft: 3,
          color: colors.info,
          marginBottom: -5,
        }}>
        {label}
      </Text>
      <TextInput
        style={{
          fontSize: 20,
          borderBottomWidth: 1,
          fontFamily: fonts.regular,
          borderBottomColor: colors.info,
          color: colors.text,
          borderBottomRightRadius: 25,
          paddingBottom: 5,
        }}
        {...inputProps}
      />
    </Animatable.View>
  );
}
