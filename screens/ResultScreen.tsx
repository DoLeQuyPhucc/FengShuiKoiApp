import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/layouts/types/navigationTypes';
import Colors from '@/constants/Colors';
import api from '@/api/axiosInstance'; 

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;

type Props = {
  route: ResultScreenRouteProp;
};

const ResultScreen: React.FC<Props> = ({ route }) => {
  const { date } = route.params;
  const [element, setElement] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const response = await api.get(`/consultation/${date}`); 
        setElement(response.data.element); 
      } catch (error) {
        console.error('Error fetching element:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElement();
  }, [date]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlueText} />
      ) : (
        <>
          <Text style={styles.title}>Your Element</Text>
          <Text style={styles.element}>{element}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.darkBlueText,
    marginBottom: 20,
  },
  element: {
    fontSize: 28,
    color: '#fff',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.darkBlueText,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResultScreen;