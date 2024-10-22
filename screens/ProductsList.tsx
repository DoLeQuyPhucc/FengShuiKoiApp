import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  owner: string;
  isApproved: boolean;
  createdAt: string;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation();
  const userId = useUserId();

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Alert.alert('Error', 'Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    navigation.navigate('CreateProduct');
  };

  const handleProductDetail = (productId: string) => {
    console.log("Navigating to product:", productId);
    navigation.navigate('ProductDetail', { productId });
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      fetchProducts();
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('CreateProduct', { product });
  };

  const showProductOptions = (product: Product) => {
    if (product.owner === userId) {
      Alert.alert(
        'Product Options',
        '',
        [
          { text: 'Edit', onPress: () => handleEditProduct(product) },
          {
            text: 'Delete',
            onPress: () => handleDeleteProduct(product._id),
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <ScrollView>
        {products.filter((product) => product.isApproved).map((product) => (
          <TouchableOpacity
            key={product._id}
            style={styles.productCard}
            onPress={() => handleProductDetail(product._id)}
            onLongPress={() => showProductOptions(product)}
          >
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage} 
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                ${product.price.toLocaleString()}
              </Text>
              <Text 
                style={styles.productDescription}
                numberOfLines={2}
              >
                {product.description}
              </Text>
            </View>
            {product.owner === userId && (
              <TouchableOpacity 
                style={styles.optionsButton}
                onPress={() => showProductOptions(product)}
              >
                <Icon name="ellipsis-vertical" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleCreateProduct}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pendingApproval: {
    fontSize: 12,
    color: '#FFA500',
    fontStyle: 'italic',
  },
  optionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProductsList;