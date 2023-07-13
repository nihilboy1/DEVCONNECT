import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastProps,
} from 'react-native-toast-message';
import {colors, fonts} from './src/theme/theme';

export const toastConfig = {
  info: (props: ToastProps) => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: colors.text,
        borderLeftWidth: 10,
        borderColor: colors.info,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontFamily: fonts.medium,
        fontSize: 18,
        color: colors.black,
      }}
    />
  ),
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={{
        backgroundColor: colors.text,
        borderLeftWidth: 10,
        borderColor: colors.success,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontFamily: fonts.medium,
        fontSize: 18,
        color: colors.black,
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: colors.text,
        borderLeftWidth: 10,
        borderColor: colors.success,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontFamily: fonts.medium,
        fontSize: 18,
        color: colors.black,
      }}
    />
  ),
};

export function showToast(
  type: 'success' | 'info' | 'error',
  position: 'bottom' | 'top',
  mainContent: string,
  otherContent?: string,
) {
  Toast.show({
    onPress: () => {
      Toast.hide();
    },
    type,
    text1: mainContent,
    text2: otherContent,
    position,
  });
}
