import { RootStackParamList } from '@/layouts/types/navigationTypes';
import { Order } from '@/shared/Interface/Order';
import { Product } from '@/shared/Interface/Product';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from "@/hooks/useNavigation";

type CheckoutScreenRouteProp = RouteProp<
  RootStackParamList,
  "CheckoutScreen"
>;

type Props = {
  route: CheckoutScreenRouteProp;
};

// const CheckoutScreen: React.FC<Props> = ({ route }) => {
    
const CheckoutScreen: React.FC<Props> = () => {

  const navigation = useNavigation();

  const product: Product = {
    name: "Smart Watch Pro 2024",
    price: 250,
    quantity: 1,
    description: "A next-gen smartwatch with advanced health monitoring features.",
    address: "123 Elm Street, Springfield, USA",
    rating: 4.5,
    comment: "Amazing features, great battery life!",
    isSelled: false
  };
  
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  const handleCheckout = () => {
    if (!address) {
      alert('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    const order: Order = {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        address,
        comment,
        isSelled: true
      };

    navigation.navigate('OrderConfirmationScreen', { order });

    console.log("Order Confirmed", {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      address,
      comment,
      isSelled: true
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      
      <View style={styles.productDetail}>
        <Text style={styles.productText}>Product Name: {product.name}</Text>
        <Text style={styles.productText}>Price: ${product.price}</Text>
        <Text style={styles.productText}>Quantity: {product.quantity}</Text>
        <Text style={styles.productText}>Description: {product.description}</Text>
        <Text style={styles.productText}>Rating: {product.rating}</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your shipping address"
        value={address}
        onChangeText={setAddress}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Leave a comment (optional)"
        value={comment}
        onChangeText={setComment}
      />

      <Button title="Confirm and Pay" onPress={handleCheckout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productDetail: {
    marginBottom: 20,
  },
  productText: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default CheckoutScreen;
