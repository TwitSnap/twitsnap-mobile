import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Title,
  Paragraph,
  Card,
  HelperText,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomButton from "../components/CustomButton";
import RegisterHandler from "../handlers/RegisterHandler";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    setUsernameError(username === "");
    setEmailError(email === "");
    setPasswordError(password === "");
    setPasswordLengthError(password.length < 8);
    setConfirmPasswordError(password !== confirmPassword);

    if (
      !username ||
      !email ||
      !password ||
      password !== confirmPassword ||
      password.length < 8
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await RegisterHandler(
        username,
        email,
        password,
        phone,
        country,
      );

      if (result && result.uid) {
        Alert.alert("Success", "Account registered successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else if (result) {
        Alert.alert("Registration failed", result.message);
      } else {
        Alert.alert("Registration failed", "Server error");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Title style={styles.title}>Register</Title>
        <Paragraph style={styles.subtitle}>Create a new account</Paragraph>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              autoCapitalize={"none"}
              label="Username"
              value={username}
              onChangeText={setUsername}
              error={usernameError}
            />
            <HelperText type="error" visible={usernameError}>
              Username is required
            </HelperText>
            <Divider style={styles.divider} />
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              keyboardType="email-address"
              autoCapitalize={"none"}
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
            <HelperText type="error" visible={emailError}>
              Email is required
            </HelperText>
            <Divider style={styles.divider} />
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              keyboardType="number-pad"
              autoCapitalize={"none"}
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
            />
            <HelperText type="error" visible={false}>
              Just here for adding space between the 2 inputs.
            </HelperText>
            <Divider style={styles.divider} />
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              autoCapitalize={"none"}
              label="Country"
              value={country}
              onChangeText={setCountry}
            />
            <HelperText type="error" visible={false}>
              Just here for adding space between the 2 inputs.
            </HelperText>
            <Divider style={styles.divider} />
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              autoCapitalize={"none"}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={passwordError}
            />
            <HelperText type="error" visible={passwordError}>
              Password is required
            </HelperText>
            <HelperText type="error" visible={passwordLengthError}>
              Password must be at least 8 characters
            </HelperText>
            <Divider style={styles.divider} />
            <TextInput
              style={styles.input}
              theme={{ colors: { primary: "#1E88E5" } }}
              autoCapitalize={"none"}
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              error={confirmPasswordError}
            />
            <HelperText type="error" visible={confirmPasswordError}>
              Passwords do not match
            </HelperText>
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ marginRight: 20 }}
            >
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                size={25}
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <CustomButton
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#E3F2FD",
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
  divider: {
    marginVertical: 8,
  },
});

export default RegisterScreen;
