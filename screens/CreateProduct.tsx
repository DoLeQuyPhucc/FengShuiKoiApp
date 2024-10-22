import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '@/api/axiosInstance';
import { useNavigation, useRoute } from '@/hooks/useNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

interface RouteParams {
  product?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

const CreateProduct = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as RouteParams || {};
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ? product.price.toString() : '',
    image: product?.image || '',
  });
  const [imageFile, setImageFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      description: '',
      price: '',
      image: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
      isValid = false;
    }

    if (!isEditing && !imageFile && !formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageFile(result.assets[0]);
        setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);

      if (imageFile) {
        const imageUri = imageFile.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image';

        formDataToSend.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      if (isEditing) {
        await axiosInstance.put(`/products/${product._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await axiosInstance.post('/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Success', 'Product created successfully');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting product:', error);
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Product' : 'Create New Product'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : undefined]}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Product name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description ? styles.inputError : undefined]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Product description"
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={[styles.input, errors.price ? styles.inputError : undefined]}
            value={formData.price}
            onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
            placeholder="Product price"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={pickImage}
          >
            <Icon name="camera" size={24} color="#666" />
            <Text style={styles.imagePickerText}>
              {imageFile ? 'Change Image' : 'Select Image'}
            </Text>
          </TouchableOpacity>
          
          {formData.image && (
            <Image 
              source={{ uri: formData.image }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Product' : 'Create Product'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
});

export default CreateProduct;