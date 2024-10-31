import React from "react";
import { useFonts } from "expo-font";
import Navigation from "./layouts/Navigation";
import fonts from "./config/fonts";
import Toast from "react-native-toast-message";
import { SocketProvider } from "./context/SocketContext";
import { FavoriteProvider } from "./context/FavouriteBlogContext";
import { CartProvider } from "./context/CartContext";
import { StripeProvider } from "@stripe/stripe-react-native";

const STRIPE_KEY =
  'pk_test_51QG1BCFZYtuiwMkRanQqBx1ybBgNqkztXRBPBda7ETS0kE5o5rJmnzxx94u3EZg8GMlLOXMBZK7K23P9zlZKDVXo00gWFlfPc0';

export default function App() {
  let [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
    <StripeProvider publishableKey={STRIPE_KEY}>
      <SocketProvider>
        <CartProvider>
          <FavoriteProvider>
            <Navigation />
            <Toast />
          </FavoriteProvider>
        </CartProvider>
      </SocketProvider>
    </StripeProvider>
    </>
  );
}
