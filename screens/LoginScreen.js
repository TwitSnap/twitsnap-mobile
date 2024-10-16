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
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useUser } from "../contexts/UserContext";
import CustomButton from "../components/CustomButton";
import LoginHandler from "../handlers/LoginHandler";
import GetMyProfileHandler from "../handlers/GetMyProfileHandler";
import { auth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setLoggedInUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "450665613455-ui2sreo4d8uf4m4jjqqqskbqpb6q3sr3.apps.googleusercontent.com",
    redirectUri: "https://twitsnap-57128.firebaseapp.com/__/auth/handler",
    scopes: ["profile", "email"],
  });

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
      const credential = GoogleAuthProvider.credential(idToken);

      const firebaseUser = await signInWithCredential(auth, credential);

      const token = await firebaseUser.user.getIdToken();
      const res = await fetch(`${GATEWAY_URL}/api/v1/register/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "WelcomeScreen" }],
        });
      } else {
        Alert.alert("Google Login failed", "Please try again.");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleLogin = async () => {
    setEmailError(email === "");
    setPasswordError(password === "");

    if (!email || !password) {
      return;
    }

    try {
      const result = await LoginHandler(email, password);
      setIsLoading(true);
      if (result === 0) {
        const profileData = await GetMyProfileHandler();
        setLoggedInUser(profileData);
        if (!profileData.verified) {
          navigation.navigate("VerifyPinScreen", {
            user_id: profileData.uid,
            email: profileData.email,
          });
        } else {
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
      console.error(error.message);
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  //if (isLoading) return (
  //<View style={styles.loadingContainer}>
  //<ActivityIndicator size="large" color="#0000ff" />
  //</View>);

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
          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
          />
          <Button
            mode="contained"
            onPress={() => {
              promptAsync();
            }}
            disabled={!request}
            style={styles.googleButton}
          >
            Login with Google
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
