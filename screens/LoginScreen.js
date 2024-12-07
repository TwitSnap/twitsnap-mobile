import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card,
  HelperText,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useUser } from "../contexts/UserContext";
import LoginHandler from "../handlers/LoginHandler";
import GoogleLoginHandler from "../handlers/GoogleLoginHandler";
import GetMyProfileHandler from "../handlers/GetMyProfileHandler";
import EditMyProfileHandler from "../handlers/EditMyProfileHandler";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import messaging from "@react-native-firebase/messaging";
import GetInterestsHandler from "../handlers/GetInterestsHandler";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setLoggedInUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
   const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "450665613455-2rldm4tb9moq4o4if0g78jjf75rckamg.apps.googleusercontent.com",
  });

  const fetchInterests = async () => {
    try {
      const interestsData = await GetInterestsHandler();
      console.log(interestsData);
      await AsyncStorage.setItem("interests", JSON.stringify(interestsData));
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  useEffect(() => {
    // Comprobar si ya existe un token en AsyncStorage
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const profileData = await GetMyProfileHandler();
          setLoggedInUser(profileData);
          if (!profileData.verified) {
          navigation.navigate("VerifyPinScreen", {
            user_id: profileData.uid,
            email: profileData.email,
          });
        } else {
          await registerForPushNotificationsAsync();
          navigation.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          });
        }}
      } catch (error) {
        console.error("Error checking token:", error);
      }
      setIsLoadingInitial(false); 
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (response && response.type === "success") {
      const { authentication } = response;

      if (authentication && authentication.idToken) {
        handleGoogleLogin(authentication.idToken);
      } else {
        console.error("Authentication object is missing idToken");
        Alert.alert(
          "Authentication Error",
          "Unable to retrieve authentication token.",
        );
      }
    } else if (response && response.type === "error") {
      console.error("Google Auth Error:", response.error);
      Alert.alert(
        "Authentication Error",
        "An error occurred during authentication.",
      );
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      setIsLoadingGoogle(true);
      const credential = GoogleAuthProvider.credential(idToken);
      const firebaseUser = await signInWithCredential(auth, credential);
      const token = await firebaseUser.user.getIdToken();

      const result = await GoogleLoginHandler(token);

      if (result === 0) {
        const profileData = await GetMyProfileHandler();
        setLoggedInUser(profileData);
        setIsLoadingGoogle(false);
        if (!profileData.verified) {
          navigation.navigate("VerifyPinScreen", {
            user_id: profileData.uid,
            email: profileData.email,
          });
        } else {
          await registerForPushNotificationsAsync();
          navigation.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          });
        }
      } else {
        Alert.alert("Google Login failed", result);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      const token = await messaging().getToken();
      console.log(token);
      if (token) {
        await EditMyProfileHandler(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          token,
        );
      }
    } else {
      console.log("Permission not granted");
    }
  };

  const handleLogin = async () => {
    setEmailError(email === "");
    setPasswordError(password === "");

    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await LoginHandler(email, password);
      fetchInterests();
      if (result === 0) {
        const profileData = await GetMyProfileHandler();
        setLoggedInUser(profileData);
        if (!profileData.verified) {
          navigation.navigate("VerifyPinScreen", {
            user_id: profileData.uid,
            email: profileData.email,
          });
        } else {
          await registerForPushNotificationsAsync();
          navigation.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          });
        }
      } else if (result) {
        Alert.alert("Login failed", result.message);
      } else {
        Alert.alert("Login failed", "Server error");
      }

      setIsLoading(false);
    } catch (error) {
      //console.error(error.message);
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

    if (isLoadingInitial) {
    // Pantalla de carga inicial
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.image} />
      <Title style={styles.title}>TwitSnap</Title>
      <Paragraph style={styles.subtitle}>
        Please enter your credentials
      </Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            label="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            theme={{ colors: { primary: "#1E88E5" } }}
            error={emailError}
            autoCapitalize={"none"}
          />
          <HelperText type="error" visible={emailError}>
            Email is required
          </HelperText>
          <Divider style={styles.divider} />
          <TextInput
            style={styles.input}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            theme={{ colors: { primary: "#1E88E5" } }}
            error={passwordError}
            autoCapitalize={"none"}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <HelperText type="error" visible={passwordError}>
            Password is required
          </HelperText>
          <Divider style={styles.divider} />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              "Login"
            )}
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              promptAsync();
            }}
            disabled={!request}
            style={styles.googleButton}
          >
            {isLoadingGoogle ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              "Login with Google"
            )}
          </Button>
          <Button
            mode="text"
            onPress={handleRegister}
            style={styles.registerButton}
          >
            Don't have an account? Register
          </Button>
          <Button
            mode="text"
            onPress={handleForgotPassword}
            style={styles.forgotPasswordButton}
          >
            Forgot Password?
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E3F2FD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    color: "#0D47A1",
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    color: "#0D47A1",
  },
  card: {
    padding: 16,
    elevation: 4,
    backgroundColor: "#d4e6f1",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#1E88E5",
  },
  googleButton: {
    marginTop: 16,
    backgroundColor: "#db4a39",
  },
  registerButton: {
    marginTop: 12,
  },
  forgotPasswordButton: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 8,
  },
});

export default LoginScreen;
