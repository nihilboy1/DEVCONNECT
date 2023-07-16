import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastProps,
} from 'react-native-toast-message';

export const toastConfig = {
  info: (props: ToastProps) => {
    return (
      <InfoToast
        {...props}
        style={{
          backgroundColor: '#F2F2F2',
          borderLeftWidth: 10,
          borderWidth: 1,
          borderColor: '#6C6D73',
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1NumberOfLines={2}
        text1Style={{
          fontFamily: 'Rubik-Medium',
          fontSize: 18,
          color: '#161A26',
        }}
      />
    );
  },
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={{
        backgroundColor: '#F2F2F2',
        borderLeftWidth: 10,
        borderColor: '#dcf8c5',
        minHeight: 50,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1NumberOfLines={2}
      text1Style={{
        fontFamily: 'Rubik-Medium',
        fontSize: 18,
        color: '#161A26',
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#F2F2F2',
        borderLeftWidth: 10,
        borderColor: '#ee6b6e',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1NumberOfLines={2}
      text1Style={{
        fontFamily: 'Rubik-Medium',
        fontSize: 18,
        color: '#161A26',
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
