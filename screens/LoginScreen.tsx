import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacing from "@/contants/Spacing";
import FontSize from "@/contants/FontSize";
import Colors from "@/contants/Colors";
import Font from "@/contants/Font";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "@/components/AppTextInput";
import { useNavigation } from "@/hooks/useNavigation";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <SafeAreaView>
      <View style={{ padding: Spacing * 2 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Login here</Text>
          <Text style={styles.subtitle}>Welcome back you've been missed!</Text>
        </View>
        <View style={{ marginVertical: Spacing * 3 }}>
          <AppTextInput 
            placeholder="Username" 
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />
          <AppTextInput 
            placeholder="Password" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={styles.forgotPassword}>Forgot your password ?</Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signInText}>Sign in</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")} style={{ padding: Spacing }}>
          <Text style={styles.createAccountText}>Create new account</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.xLarge,
    color: Colors.warmOrange,
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
  },
  subtitle: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.large,
    maxWidth: "60%",
    textAlign: "center",
  },
  forgotPassword: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
    color: Colors.warmOrange,
    alignSelf: "flex-end",
  },
  signInButton: {
    padding: Spacing * 2,
    backgroundColor: Colors.warmOrange,
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.warmOrange,
    shadowOffset: { width: 0, height: Spacing },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  signInText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  createAccountText: {
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

export default LoginScreen;
