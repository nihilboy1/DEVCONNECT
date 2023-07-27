import {TouchableOpacity} from 'react-native';
import {useThemeContext} from '../hooks/useThemeContext';

type OpenModalWidgetProps = {
  setModalVisible: (value: boolean) => void;
  Icon: JSX.Element;
};

export function OpenModalWidget({setModalVisible, Icon}: OpenModalWidgetProps) {
  const {colors} = useThemeContext();

  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
      }}
      style={{
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
      }}>
      {Icon}
    </TouchableOpacity>
  );
}
