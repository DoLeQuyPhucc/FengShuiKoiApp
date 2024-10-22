import React from "react";
import { useFonts } from "expo-font";
import Navigation from "./layouts/Navigation";
import fonts from "./config/fonts";
import Toast from "react-native-toast-message";
import { SocketProvider } from "./context/SocketContext";
import { FavoriteProvider } from "./context/FavouriteBlogContext";
import { CartProvider } from "./context/CartContext";

export default function App() {
  let [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <SocketProvider>
        <CartProvider>
          <FavoriteProvider>
            <Navigation />
            <Toast />
          </FavoriteProvider>
        </CartProvider>
      </SocketProvider>
    </>
  );
}
