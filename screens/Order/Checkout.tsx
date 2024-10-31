import { RootStackParamList } from '@/layouts/types/navigationTypes';
import { Order } from '@/shared/Interface/Order';
import { Product } from '@/shared/Interface/Product';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from "@/hooks/useNavigation";
import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';
import { useStripe } from '@stripe/stripe-react-native';
import { PaymentService } from './PaymentService';
import { useCart } from '@/context/CartContext';

type CheckoutScreenRouteProp = RouteProp<
  RootStackParamList,
  "CheckoutScreen"
>;

type Props = {
  route: CheckoutScreenRouteProp;
};

const CheckoutScreen: React.FC<Props> = ({ route }) => {

  const stripe = useStripe();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const navigation = useNavigation();

  const items = route.params.items;
  
  const userId = useUserId();

  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const checkoutOrder = async (order: Order): Promise<void> => {
    console.log('checkoutOrder started'); // Log khi hàm bắt đầu
    try {
      const response = await Promise.all(items.map(async (item) => {
        return await axiosInstance.get<Product[]>(`/products/checkout/${userId}&${item.productId}`);
      }));
      const allSuccessful = response.every(response => response.status === 200);

      if (allSuccessful) {
        console.log('checkoutOrder successful');
        clearCart();
        navigation.navigate('OrderConfirmationScreen', { order });
      } else {
        console.error('One or more requests failed');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
    } finally {
      console.log('checkoutOrder ended');
    }
  };

  const handleCheckout = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter your shipping address');
      return;
    }
  
    Alert.alert(
      'Confirmation',
      'Do you want to proceed with payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
            try {
              setLoading(true);
              
              // Step 1: Tạo payment intent
              const clientSecret = await PaymentService.createPaymentIntent(totalAmount);
  
              // Step 2: Khởi tạo Payment sheet
              const initResponse = await stripe.initPaymentSheet({
                merchantDisplayName: "notJust.dev",
                paymentIntentClientSecret: clientSecret,
              });
  
              if (initResponse.error) {
                console.log(initResponse.error);
                Alert.alert("Something went wrong");
                setLoading(false);
                return;
              }
  
              // Step 3: Hiển thị Payment sheet và xử lý thanh toán
              const paymentResponse = await stripe.presentPaymentSheet();
  
              if (paymentResponse.error) {
                Alert.alert(
                  `Error code: ${paymentResponse.error.code}`,
                  paymentResponse.error.message
                );
                setLoading(false);
                return;
              }
  
              // Nếu thanh toán thành công, tạo đối tượng order và gọi checkoutOrder
              const order: Order = {
                items: items,
                totalPrice: totalAmount,
                address,
                comment,
                isSelled: true
              };
              
              // Gọi hàm checkoutOrder
              await checkoutOrder(order);
  
            } catch (error) {
              console.error('Payment error:', error);
              Alert.alert('Error', 'Payment failed. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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
        
        <TouchableOpacity 
          style={[
            styles.checkoutButton,
            loading && styles.disabledButton
          ]} 
          onPress={handleCheckout}
          disabled={loading}
        >
          <Text style={styles.checkoutButtonText}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Text>
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
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#cccccc'
  }
});

export default CheckoutScreen;
