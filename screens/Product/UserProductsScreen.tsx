import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axiosInstance from '@/api/axiosInstance';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@/hooks/useNavigation';
import { Owner } from './ProductsList';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const UserProductsScreen = () => {
  const route = useRoute<RouteProp<{ params: { owner: Owner } }, 'params'>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const response = await axiosInstance.get(`/products/${route.params.owner._id}/products`);
        setProducts(response.data);
        console.log('User products:', response.data);
      } catch (error) {
        console.error('Failed to fetch user products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [route.params.owner._id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const placeholderAvatar = 'https://wallpaperaccess.com/full/6999296.jpg';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: placeholderAvatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{route.params.owner.name}</Text>
          <Text style={styles.userEmail}>{route.params.owner.email}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Products</Text>
      {products.map((product) => (
        <TouchableOpacity key={product._id} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
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
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserProductsScreen;