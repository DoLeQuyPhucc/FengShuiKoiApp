import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@/hooks/useNavigation';

const WelcomeScreen = () => {

  const navigation = useNavigation();
  
  const handleLogin = () => {
    navigation.navigate("Main", {
      screen: "Home",
    })
  }

  return (
    <ImageBackground
      source={require('../assets/images/welcome-screen.webp')}
      style={styles.background}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Feng Shui</Text>
        <Text style={styles.subtitle}>Feng Shui for Koi Fish</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>Feng Shui for Koi fish</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Start Consultation</Text>
          </TouchableOpacity>

          <View style={styles.smallButtonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
              <Text style={styles.smallButtonText}>Start Blogs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
              <Text style={styles.smallButtonText}>Read Blogs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 20,
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
    color: '#133048',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#133048',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
  },
  mainButton: {
    backgroundColor: '#1abc9c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  smallButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WelcomeScreen;
