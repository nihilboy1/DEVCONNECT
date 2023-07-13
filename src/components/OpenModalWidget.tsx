import {StyleSheet, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../theme/theme';

type OpenModalWidgetProps = {
  setModalVisible: (value: boolean) => void;
  iconName: string;
};

export function OpenModalWidget({
  setModalVisible,
  iconName,
}: OpenModalWidgetProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
      }}
      style={S.button}>
      <Entypo name={iconName} color={colors.black} size={25} />
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  button: {
    position: 'absolute',
    right: '6%',
    bottom: '6%',
    width: 60,
    height: 60,
    zIndex: 1000,
    backgroundColor: colors.success,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
