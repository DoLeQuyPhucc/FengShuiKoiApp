import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Surface } from 'react-native-paper';
import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  totalReviews: number;
  reviews: Review[];
  id: string;
}

type TabType = 'approved' | 'notApproved';

const MyProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('approved');
  const navigation = useNavigation();
  const userId = useUserId();

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Product[]>(`/products/${userId}/products`);
      setProducts(response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error?.response?.status === 401) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderRatingStars = (rating: number): JSX.Element => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
      </View>
    );
  };

  const handleEditProduct = (productId: string): void => {
    // Navigate to edit product screen
    console.log('Edit product', productId);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderProductCard = (product: Product): JSX.Element => (
    <Card key={product._id} style={styles.card}>
      <Card.Cover source={{ uri: product.image }} style={styles.cardImage} />
      <Card.Content>
        <Title>{product.name}</Title>
        <Paragraph numberOfLines={2} style={styles.description}>
          {product.description}
        </Paragraph>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        {renderRatingStars(product.avgRating)}
        <View style={styles.reviewInfo}>
          <Icon name="chatbubble-outline" size={16} color="#666" />
          <Text style={styles.reviewCount}>{product.totalReviews} đánh giá</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => handleEditProduct(product._id)}
          style={styles.editButton}
        >
          Chỉnh sửa
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const approvedProducts = products.filter(product => product.isApproved);
  const notApprovedProducts = products.filter(product => !product.isApproved);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'approved' && styles.activeTab
          ]}
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'approved' && styles.activeTabText
          ]}>
            Đã duyệt ({approvedProducts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notApproved' && styles.activeTab
          ]}
          onPress={() => setActiveTab('notApproved')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'notApproved' && styles.activeTabText
          ]}>
            Chờ duyệt ({notApprovedProducts.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'approved' ? (
          approvedProducts.length > 0 ? (
            approvedProducts.map(renderProductCard)
          ) : (
            <Text style={styles.emptyText}>Không có sản phẩm đã được duyệt</Text>
          )
        ) : (
          notApprovedProducts.length > 0 ? (
            notApprovedProducts.map(renderProductCard)
          ) : (
            <Text style={styles.emptyText}>Không có sản phẩm chờ duyệt</Text>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardImage: {
    height: 200,
  },
  description: {
    marginVertical: 8,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
  },
  reviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewCount: {
    marginLeft: 4,
    color: '#666',
  },
  editButton: {
    marginLeft: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
});

export default MyProductsScreen;