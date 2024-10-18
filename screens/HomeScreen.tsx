import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';
import { RootStackParamList } from '@/layouts/types/navigationTypes';
import ResultModal from '@/components/modal/ResultModal';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const validateDate = () => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (year <= 1900) {
      Alert.alert('Invalid Date', 'Please enter a valid date.');
      return false;
    }

    return true;
  };

  const handleResult = () => {
    if (validateDate()) {
      setShowModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/fishkoi.webp')}
        style={styles.background}
        imageStyle={styles.image}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: Colors.lightGreen }]}>FengShuiKoi</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: Colors.lightGreen, fontWeight: 'bold' }]}>
            Nhập ngày sinh của bạn
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.dateTimePicker}
                textColor={Colors.darkBlueText} // Works only for iOS
              />
            </View>
          )}
          <TouchableOpacity style={styles.resultButton} onPress={handleResult}>
            <Text style={styles.buttonText}>Kết quả</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ResultModal date={date.toISOString().split('T')[0]} onClose={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  image: {
    resizeMode: 'cover',
  },
  formContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginHorizontal: 30, // Add margin to both sides
  },
  titleContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.darkBlueText,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  label: {
    fontSize: 18,
    color: Colors.darkBlueText,
    marginTop: 10,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: '100%', // Make the picker container full width
  },
  dateTimePicker: {
    width: '100%', // Make the DateTimePicker full width
  },
  resultButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default HomeScreen;