import { 
  useNavigation as useNativeNavigation, 
  NavigationProp,
  useRoute as useNativeRoute,
  RouteProp
} from '@react-navigation/native';
import { RootStackParamList } from '@/layouts/types/navigationTypes';

export const useNavigation = () => 
  useNativeNavigation<NavigationProp<RootStackParamList>>();

export const useRoute = <T extends keyof RootStackParamList>() => 
  useNativeRoute<RouteProp<RootStackParamList, T>>();