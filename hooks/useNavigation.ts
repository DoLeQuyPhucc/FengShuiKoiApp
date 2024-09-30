import { useNavigation as useNativeNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/layouts/types/navigationTypes';

export const useNavigation = () => useNativeNavigation<NavigationProp<RootStackParamList>>();
