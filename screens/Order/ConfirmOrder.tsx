import { RootStackParamList } from '@/layouts/types/navigationTypes';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OrderConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  "OrderConfirmationScreen"
>;

type Props = {
  route: OrderConfirmationScreenRouteProp;
};

const OrderConfirmationScreen: React.FC<Props> = ({ route }) => {
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text>Product: {order.name}</Text>
      <Text>Price: ${order.price}</Text>
      <Text>Quantity: {order.quantity}</Text>
      <Text>Shipping to: {order.address}</Text>
      <Text>Comment: {order.comment || 'None'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OrderConfirmationScreen;
