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
import Spacing from "@/contants/Spacing";
import FontSize from "@/contants/FontSize";
import Colors from "@/contants/Colors";
import Font from "@/contants/Font";
import AppTextInput from "@/components/AppTextInput";
import { useNavigation } from "@/hooks/useNavigation";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setUserName('');
    setPhoneNumber('');
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={{ padding: Spacing * 2 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.header}>Create account</Text>
            <Text style={styles.subHeader}>
              Create an account so you can explore all the existing jobs
            </Text>
          </View>
          <View style={{ marginVertical: Spacing * 3 }}>
            <AppTextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <AppTextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <AppTextInput placeholder="User Name" value={userName} onChangeText={setUserName} />
            <AppTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppTextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
            <AppTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <AppTextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </View>

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
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
    color: Colors.warmOrange,
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
    backgroundColor: Colors.warmOrange,
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.warmOrange,
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
    color: Colors.warmOrange,
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
