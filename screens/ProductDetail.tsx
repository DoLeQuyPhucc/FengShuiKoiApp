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

  const { addToCart } = useCart();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

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

          {/* Review Form - Only show if user is not the owner */}
          {userId !== product.owner && (
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
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
});

export default ProductDetail;