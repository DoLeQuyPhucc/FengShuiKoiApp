import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/Colors';

function HomeScreen() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateDate = () => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(dayNum) || dayNum <= 0 || dayNum > 31) {
      Alert.alert('Invalid Day', 'Day must be a number between 1 and 31.');
      return false;
    }

    if (isNaN(monthNum) || monthNum <= 0 || monthNum > 12) {
      Alert.alert('Invalid Month', 'Month must be a number between 1 and 12.');
      return false;
    }

    if (isNaN(yearNum) || yearNum <= 1900) {
      Alert.alert('Invalid Year', 'Year must be a positive number.');
      return false;
    }

    return true;
  };

  const handleResult = () => {
    if (validateDate()) {
      console.log(`Date of Birth: ${day}/${month}/${year}`);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/fishkoi.webp')}
      style={styles.background}
      imageStyle={styles.image}
    >
      <View style={styles.titleContainer}>
  <Text style={[styles.title, { color: Colors.lightGreen }]}>FengShuiKoi</Text>
</View>

      <View style={styles.container}>
      <Text style={[styles.label, { color: Colors.lightGreen }]}>Enter your date of birth</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={[styles.input, focusedField === 'day' && styles.inputFocused]}
            keyboardType="numeric"
            value={day}
            onChangeText={setDay}
            placeholder="DD"
            placeholderTextColor="#ccc"
            onFocus={() => handleFocus('day')}
            onBlur={handleBlur}
          />
          <TextInput
            style={[styles.input, focusedField === 'month' && styles.inputFocused]}
            keyboardType="numeric"
            value={month}
            onChangeText={setMonth}
            placeholder="MM"
            placeholderTextColor="#ccc"
            onFocus={() => handleFocus('month')}
            onBlur={handleBlur}
          />
          <TextInput
            style={[styles.input, focusedField === 'year' && styles.inputFocused]}
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
            placeholder="YYYY"
            placeholderTextColor="#ccc"
            onFocus={() => handleFocus('year')}
            onBlur={handleBlur}
          />
        </View>
        <TouchableOpacity style={styles.resultButton} onPress={handleResult}>
          <Text style={styles.buttonText}>Result</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  inputFocused: {
    borderColor: Colors.darkBlueText,
    shadowColor: Colors.darkBlueText,
    elevation: 4,
  },
  resultButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;