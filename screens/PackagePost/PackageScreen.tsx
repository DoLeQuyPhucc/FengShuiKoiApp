import axiosInstance from '@/api/axiosInstance';
import useUserId from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

interface Package {
    _id: string;
    name: string;
    price: number;
    description: string;
    numberOfPosted: number;
}

const PackageScreen = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package>();
    const userId = useUserId();

  const fetchPackage = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Package[]>(`/package`);
      setPackages(response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error?.response?.status === 401) {
        setPackages([]);
      }
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleRegister = async () => {
    if (selectedPackage) {
        if (!userId) {
            console.log('User not found');
            return;
        }
      const response = await axiosInstance.get<Package[]>(`/package/register/${userId}&${selectedPackage._id}`);

        if (response.data) {
            Alert.alert('Register success');
        } else {
            console.log('Register failed:', response.data);
        }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Chọn Gói Đăng Ký</Text>
        
        <View style={styles.packagesContainer}>
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg._id}
              style={[
                styles.packageCard,
                selectedPackage?._id === pkg._id && styles.selectedPackage
              ]}
              onPress={() => handlePackageSelect(pkg)}
            >
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packagePrice}>{formatPrice(pkg.price)}</Text>
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresText}>
                  ✓ Số lượng bài đăng: {pkg.numberOfPosted}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.registerButton,
            !selectedPackage && styles.disabledButton
          ]}
          onPress={handleRegister}
          disabled={!selectedPackage}
        >
          <Text style={styles.registerButtonText}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  packagesContainer: {
    paddingHorizontal: 16,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedPackage: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PackageScreen;