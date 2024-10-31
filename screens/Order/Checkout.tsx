import { RootStackParamList } from '@/layouts/types/navigationTypes';
import { Order } from '@/shared/Interface/Order';
import { Product } from '@/shared/Interface/Product';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from "@/hooks/useNavigation";
import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';

type CheckoutScreenRouteProp = RouteProp<
  RootStackParamList,
  "CheckoutScreen"
>;

type Props = {
  route: CheckoutScreenRouteProp;
};

const CheckoutScreen: React.FC<Props> = ({ route }) => {

  const navigation = useNavigation();

  const items = route.params.items;
  
  const userId = useUserId();

  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkoutOrder = async (order: Order): Promise<void> => {
    try {
      const response = items.map(async (item) => {
        await axiosInstance.get<Product[]>(`/products/checkout/${userId}&${item.productId}`);
      });
      if (response) {
        navigation.navigate('OrderConfirmationScreen', { order })
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCheckout = () => {
    if (!address) {
      alert('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    const order: Order = {
        items: items,
        totalPrice: totalAmount,
        address,
        comment,
        isSelled: true
      };

      Alert.alert(
        'Confirmation',
        'Do you want to confirm this order?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () =>  checkoutOrder(order) }
        ]
      );

   

    // console.log("Order Confirmed", {
    //   name: product.name,
    //   price: product.price,
    //   quantity: product.quantity,
    //   address,
    //   comment,
    //   isSelled: true
    // });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <ScrollView style={styles.container}>
        {items.map((item) => (
          <View key={item.productId} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
              <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

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
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${totalAmount.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Confirm!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginVertical: 16,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
