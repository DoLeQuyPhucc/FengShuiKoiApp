import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@/hooks/useNavigation';
import { RootStackParamList } from '@/layouts/types/navigationTypes';
import { Order } from '@/shared/Interface/Order';

type OrderConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OrderConfirmationScreen'
>;

type Props = {
  route: OrderConfirmationScreenRouteProp;
};

const OrderConfirmationScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  
  const { items, totalPrice, address, comment, isSelled } = route.params.order as Order;

  const handleConfirm = () => {
    navigation.navigate("Main", {
      screen: "Home"
    });
  };

  return (
    <View  style={styles.container}>
      <Text style={styles.title}>Checkout successfully!</Text>
      <Text style={styles.subtitle}>Address:</Text>
      <Text style={styles.text}>{address}</Text>
      
      <ScrollView>
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

      {/* Thêm dòng text cảm ơn */}
      <Text style={styles.thankYouText}>Cảm ơn bạn đã mua hàng!</Text>

      <TouchableOpacity style={styles.goHomeBtnGroup}>
        <View style={styles.goHomeBtn}>
          <Button title="Go to Home" onPress={handleConfirm} />
        </View>
      </TouchableOpacity>
    </View>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
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
  quantityText: {
    fontSize: 16,
  },
  goHomeBtnGroup: {
    marginTop: 20,
  },
  goHomeBtn: {
    padding: 20,
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: 'green',
  },
});

export default OrderConfirmationScreen;
