import axiosInstance from "@/api/axiosInstance";
import Colors from "@/constants/Colors";
import useUserId from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@/hooks/useNavigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface Package {
  _id: string;
  name: string;
  price: number;
  description: string;
  numberOfPosted: number;
  count?: number;
}


interface User {
    name: string;
    email: string;
    numberOfPostedRemind: number;
}  

const MyPackageScreen = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const [userData, setUserData] = useState<User | null>(null);
  const userId = useUserId();
  const navigation = useNavigation();
  console.log(userId);

  const groupPackages = (
    packages: Package[]
  ): (Package & { count: number })[] => {
    const packageMap: { [key: string]: Package & { count: number } } = {};

    packages.forEach((pkg) => {
      if (packageMap[pkg._id]) {
        // Nếu gói đã tồn tại, tăng count lên
        packageMap[pkg._id].count += 1;
      } else {
        // Nếu chưa tồn tại, thêm gói vào packageMap với count = 1
        packageMap[pkg._id] = { ...pkg, count: 1 };
      }
    });

    return Object.values(packageMap);
  };

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const fetchPackage = async (): Promise<void> => {
    try {
        if(!userId) {
            return;
        }

      const response = await axiosInstance.get<Package[]>(
        `/package/myPackage/${userId}`
      );
      const groupedPackages = groupPackages(response.data);
      setPackages(groupedPackages);
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      if (error?.response?.status === 401) {
        setPackages([]);
      }
    }
  };

  
  useFocusEffect(
    React.useCallback(() => {
        fetchPackage();
        fetchUserData();
    }, [userId])
  );

  //const total numberOfPosted of packages
    const totalNumberOfPosted = (packages: Package[]): number => {
        return packages.reduce((total, pkg) => total + pkg.numberOfPosted * (pkg?.count ?? 1), 0);
    };
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleRegisterNewPackage = () => {
      Alert.alert(
        'Do you want to register new package?',
        '',
        [
          { text: 'No', 
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => navigation.navigate('PackageScreen'),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );

  };

  if(packages.length === 0) {
    return <View><Text>Loading...</Text></View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Gói của tôi</Text>
        
        <Text style={styles.title}>Số lần đăng còn lại {userData?.numberOfPostedRemind}/{totalNumberOfPosted(packages)}</Text>

        <View style={styles.packagesContainer}>
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg._id}
              style={[
                styles.packageCard,
                selectedPackage?._id === pkg._id && styles.selectedPackage,
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
                {(pkg.count ?? 0) > 1 && (
                  <Text style={styles.purchaseCountLabel}>
                    Mua {pkg.count} lần
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleRegisterNewPackage}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  packagesContainer: {
    paddingHorizontal: 16,
  },
  packageCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedPackage: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  packageName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  purchaseCountLabel: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.commonBlue,
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

export default MyPackageScreen;
