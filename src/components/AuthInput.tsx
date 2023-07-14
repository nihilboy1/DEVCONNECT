import {StyleSheet, Text, TextInput, TextInputProps} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {colors, fonts} from '../theme/theme';

type AuthPageInputProps = TextInputProps & {
  label: string;
};

export function AuthInput({label, ...inputProps}: AuthPageInputProps) {
  return (
    <Animatable.View animation="fadeInLeft" style={S.inputBox}>
      <Text style={S.inputLabelText}>{label}</Text>
      <TextInput style={S.input} {...inputProps} />
    </Animatable.View>
  );
}

const S = StyleSheet.create({
  inputBox: {
    width: '100%',
  },

  inputLabelText: {
    marginLeft: 3,
    color: colors.info,
    marginBottom: -5,
  },

  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    fontFamily: fonts.regular,
    borderBottomColor: colors.info,
    color: colors.text,
    borderBottomRightRadius: 25,
    paddingBottom: 5,
  },

  profileVariant: {
    fontSize: 30,
    color: colors.text,
    backgroundColor: colors.info,
    height: 50,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
  },
});
