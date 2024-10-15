import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBottomTab, { TabBarProps } from './BottomBar';
import fonts from '@/config/fonts';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types/navigationTypes'; // Import the type
import WelcomeScreen from '@/screens/WelcomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import HomeScreen from '@/screens/HomeScreen';
import NotificationScreen from '@/screens/NotificationScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ResultScreen from '@/screens/ResultScreen'; 
import BlogScreen from '@/screens/Blog/BlogsScreen';
import ChatScreen from '@/screens/ChatScreen';
const Stack = createStackNavigator<RootStackParamList>();


const tabBarProps: TabBarProps[] = [
  {
    route: 'Home',
    component: HomeScreen,
    tabBarLabel: 'Home',
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: 'home',
    },
  },
  {
    route: 'Blogs',
    component: BlogScreen,
    tabBarLabel: 'Blogs',
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: 'newspaper',
    },
  },
  {
    route: 'Notifications',
    component: ChatScreen,
    tabBarLabel: 'Notifitcations',
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: 'notifications',
    },
  },
  {
    route: 'Profile',
    component: ProfileScreen,
    tabBarLabel: 'Profile',
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: 'person',
    },
  },
];

export default function Navigation() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts(fonts);
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
  
        if (accessToken && refreshToken) {
          setInitialRoute('Main');
        } else {
          setInitialRoute('WelcomeScreen');
        }
      } catch (error) {
        console.error('Error checking initial route:', error);
      } finally {
        setAppIsReady(true);
      }
    };
  
    checkInitialRoute();
  }, []);

  if (!appIsReady || !fontsLoaded || !initialRoute) {
    return null;
  }

  return (
    <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <CustomBottomTab tabs={tabBarProps} />}
          </Stack.Screen>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }} /> 
        </Stack.Navigator>
    </NavigationContainer>
  );
}