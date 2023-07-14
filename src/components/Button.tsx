import {Text, TouchableOpacity} from 'react-native';
import {colors, fonts} from '../theme/theme';
import {Loading} from './Loading';

type ButtonProps = {
  isLoading?: boolean;
  action: () => void;
  content: string;
};

export function Button({isLoading, action, content}: ButtonProps) {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 15,
        height: 60,
        padding: 10,
        width: 320,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: colors.text,
        borderColor: colors.background,
      }}
      onPress={action}
      disabled={isLoading}>
      {isLoading ? (
        <Loading spinColor={colors.background} size={38} />
      ) : (
        <Text
          style={{
            color: colors.background,
            fontFamily: fonts.regular,
            fontSize: 24,
            textAlign: 'center',
          }}>
          {content}
        </Text>
      )}
    </TouchableOpacity>
  );
}
