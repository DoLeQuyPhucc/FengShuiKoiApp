import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '@/context/CartContext';
import { useNavigation } from '@/hooks/useNavigation';

const CartScreen = () => {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleRemoveFromCart = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Do you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) }
      ]
    );

  }

  const handleQuantityChange = (productId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    
    if (newQuantity < 1) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) }
        ]
      );
      return;
    }
    
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    // Alert.alert('Success', 'Proceed to checkout');

    setSelectedItems(items.map((item) => item.productId));

  // console.log(items);
    navigation.navigate('CheckoutScreen', { items: items });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("Main", {
              screen: "Products"
            })}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>
      
      <ScrollView style={styles.container}>
        {items.map((item) => (
          <View key={item.productId} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.productId, item.quantity, false)}
                  style={styles.quantityButton}
                >
                  <Icon name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.productId, item.quantity, true)}
                  style={styles.quantityButton}
                >
                  <Icon name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => handleRemoveFromCart(item.productId)}
              style={styles.removeButton}
            >
              <Icon name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${totalAmount.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginHorizontal: 16,
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
});

export default CartScreen;