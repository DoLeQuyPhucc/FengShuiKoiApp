import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import AppTextInput from "@/components/AppTextInput";
import { useNavigation } from "@/hooks/useNavigation";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import axiosInstance from "@/api/axiosInstance";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setBirthYear('');
    setGender('');
  };

  const registerUser = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        birthYear,
        gender
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Account created successfully');
        resetForm();
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={{ padding: Spacing * 2 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.header}>Create account</Text>
            <Text style={styles.subHeader}>
              Create an account so you can explore all Fish Koi
            </Text>
          </View>
          <View style={{ marginVertical: Spacing * 3 }}>
          <AppTextInput placeholder="Name" value={name} onChangeText={setName} />
            <AppTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <AppTextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <AppTextInput placeholder="Birth Year" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" />
            <AppTextInput placeholder="Gender" value={gender} onChangeText={setGender} />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={registerUser} disabled={loading}>
            <Text style={styles.signUpButtonText}>{loading ? 'Signing up...' : 'Sign up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={{ padding: Spacing }}>
            <Text style={styles.loginText}>Already have an account</Text>
          </TouchableOpacity>

          <View style={{ marginVertical: Spacing * 3 }}>
            <Text style={styles.orContinueText}>Or continue with</Text>
            <View style={styles.socialIconsContainer}>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-google" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-apple" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-facebook" color={Colors.text} size={Spacing * 2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: FontSize.xLarge,
    color: Colors.lightGreen,
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
  },
  subHeader: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
    maxWidth: "80%",
    textAlign: "center",
  },
  signUpButton: {
    padding: Spacing * 2,
    backgroundColor: Colors.lightGreen,
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.lightGreen,
    shadowOffset: { width: 0, height: Spacing },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  signUpButtonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
  loginText: {
    fontFamily: Font["poppins-semiBold"],
    color: Colors.text,
    textAlign: "center",
    fontSize: FontSize.small,
  },
  orContinueText: {
    fontFamily: Font["poppins-semiBold"],
    color: Colors.lightGreen,
    textAlign: "center",
    fontSize: FontSize.small,
  },
  socialIconsContainer: {
    marginTop: Spacing,
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    padding: Spacing,
    backgroundColor: Colors.gray,
    borderRadius: Spacing / 2,
    marginHorizontal: Spacing,
  },
});

export default RegisterScreen;
