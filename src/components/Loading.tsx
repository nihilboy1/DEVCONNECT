import {ActivityIndicator} from 'react-native';

type LoadingProps = {
  spinColor: string;
  size: number;
};

export function Loading({spinColor, size}: LoadingProps) {
  return <ActivityIndicator color={spinColor} size={size} />;
}
