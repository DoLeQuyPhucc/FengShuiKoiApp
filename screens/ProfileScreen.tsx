import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { Avatar, Button, Card, Text, Title } from 'react-native-paper';
import axiosInstance from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@/hooks/useNavigation';

const ProfileScreen = () => {
  interface User {
    name: string;
    email: string;
  }

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');
  
      // Navigate to the Welcome screen after logout
      navigation.navigate('WelcomeScreen');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: 'white' }}>
        {/* User Avatar and Info */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Avatar.Image
            size={120}
            source={{ uri: 'data:image/jpeg;base64,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' }}
          />
          <Title style={{ marginTop: 16 }}>{userData?.name}</Title>
          <Text style={{ color: 'gray', fontSize: 16 }}>{userData?.email}</Text>
        </View>

        {/* Profile Info Section */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>First Name</Text>
              <Text>{userData?.name.split(' ')[0]}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Last Name</Text>
              <Text>{userData?.name.split(' ')[1]}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Phone Number</Text>
              <Text>+123 456 7890</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Address</Text>
              <Text>123 Main St, City, Country</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <Button mode="contained" onPress={() => console.log('Edit Profile')} style={{ marginBottom: 16 }}>
            Edit Profile
          </Button>
          <Button mode="outlined" onPress={handleLogout} color="red">
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
