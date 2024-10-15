import React from 'react';
import { useFonts } from 'expo-font';
import Navigation from './layouts/Navigation';
import fonts from './config/fonts';
import Toast from 'react-native-toast-message';
import { SocketProvider } from './context/SocketContext';

export default function App() {
  let [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <SocketProvider>
        <Navigation />
        <Toast />
      </SocketProvider>
    </>
  );
}
