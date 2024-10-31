import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Product } from './ProductsList';
import { useNavigation } from '@/hooks/useNavigation';
import { useCart } from '@/context/CartContext';
import ReportModal from '@/components/ReportModal';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface DetailedProduct extends Product {
  avgRating: number;
  totalReviews: number;
  reviews: Review[];
}

const ProductDetail = () => {
  const route = useRoute<RouteProp<{ params: { productId: string } }, 'params'>>();
  const userId = useUserId();
  const navigation = useNavigation();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToCart } = useCart();

  const handleReport = async (reason: string, description: string) => {
    if (!product) return;
    
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/report', {
        productId: product._id,
        reason,
        description
      });
      
      Alert.alert('Success', 'Report submitted successfully');
      setIsReportModalVisible(false);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit report'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      Alert.alert('Success', 'Product added to cart');
    } else {
      Alert.alert('Error', 'Product details are not available');
    }
    Alert.alert('Success', 'Product added to cart');
  };

  useEffect(() => {
    fetchProductDetails();
  }, [route.params.productId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axiosInstance.get(`/products/${route.params.productId}`);
      const reviewsResponse = await axiosInstance.get(`/reviews/products/${route.params.productId}`);
      setProduct({
        ...response.data,
        reviews: reviewsResponse.data
      });

      console.log('Product details:', response.data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post(`/reviews/products/${route.params.productId}`, {
        rating: userRating,
        comment: comment.trim()
      });
      
      // Refresh product details to get updated reviews
      await fetchProductDetails();
      setUserRating(0);
      setComment('');
      Alert.alert('Success', 'Review submitted successfully');
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNavigateToUserProducts = () => {
    if (product) {
      navigation.navigate('UserProductsScreen', { owner: product.owner });
    }
  };

  const StarRating: React.FC<{ rating: number; onRatingChange: (rating: number) => void; disabled?: boolean }> = ({ rating, onRatingChange, disabled = false }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => !disabled && onRatingChange(star)}
            disabled={disabled}
          >
            <Icon
              name={star <= rating ? 'star' : 'star-outline'}
              size={24}
              color={star <= rating ? '#FFD700' : '#999'}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const placeholderAvatar = 'https://wallpaperaccess.com/full/6999296.jpg';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          {/* Thêm nút Report */}
          {userId !== product?.owner._id && (
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={() => setIsReportModalVisible(true)}
            >
              <Icon name="flag-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>

        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
         

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
          
          <View style={styles.ratingOverview}>
            <StarRating rating={Math.round(product.avgRating)} onRatingChange={() => {}} disabled />
            <Text style={styles.ratingText}>
              {product.avgRating.toFixed(1)} ({product.totalReviews} reviews)
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity style={styles.userInfoContainer} onPress={handleNavigateToUserProducts}>
            <Image source={{ uri: placeholderAvatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{product.owner.name}</Text>
              <Text style={styles.userEmail}>{product.owner.email}</Text>
            </View>
          </TouchableOpacity>
          {/* Review Form - Only show if user is not the owner */}
          {userId !== product.owner._id && (
            <View style={styles.reviewForm}>
              <Text style={styles.sectionTitle}>Write a Review</Text>
              <StarRating rating={userRating} onRatingChange={setUserRating} />
              <TextInput
                style={styles.commentInput}
                placeholder="Write your review here..."
                multiline
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Reviews List */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          {product.reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            product.reviews.map((review) => (
              <View key={review._id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.user.name}</Text>
                  <Text style={styles.reviewDate}>
                    {formatDate(review.createdAt)}
                  </Text>
                </View>
                <StarRating rating={review.rating} onRatingChange={() => {}} disabled />
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Icon name="cart" size={24} color="#fff" style={styles.cartIcon} />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <ReportModal
            isVisible={isReportModalVisible}
            onClose={() => setIsReportModalVisible(false)}
            onSubmit={handleReport}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#fff',
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
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
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  reviewForm: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    marginRight: 4,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  cartIcon: {
    marginRight: 4,
  },
  userProductsButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  userProductsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetail;