import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card,
  HelperText,
  Divider,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CheckPasswordTokenHandler from "../handlers/CheckPasswordTokenHandler";
import UpdatePasswordHandler from "../handlers/UpdatePasswordHandler";

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        console.log(token);
        const result = await CheckPasswordTokenHandler(token);
        if (result == true) {
          //setIsValidToken(true);
        } else {
          Alert.alert("Error", "Link expired");
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to validate token.");
        navigation.navigate("LoginScreen");
      }
    };

    checkTokenValidity();
  }, [token, navigation]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
    } else if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
    } else {
      setPasswordError(false);
      setConfirmPasswordError(false);
      try {
        const result = await UpdatePasswordHandler(token, password); // Llamamos al handler
        if (result.status == 204) {
          Alert.alert("Success", "Your password was updated");
          navigation.navigate("LoginScreen");
        } else {
          Alert.alert("Error", result.title);
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to update password.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Reset Password</Title>
      <Paragraph style={styles.subtitle}>
        Please enter your new password.
      </Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <View>
            <TextInput
              style={styles.input}
              label="New Password"
              secureTextEntry={!showPassword} // Mostrar u ocultar la contraseña
              value={password}
              onChangeText={setPassword}
              theme={{ colors: { primary: "#1E88E5" } }}
              error={passwordError}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                size={25}
                color="#1E88E5"
              />
            </TouchableOpacity>
          </View>
          <HelperText type="error" visible={passwordError}>
            Password is required
          </HelperText>

          <View>
            <TextInput
              style={styles.input}
              label="Confirm Password"
              secureTextEntry={!showPassword} // Mostrar u ocultar la contraseña
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              theme={{ colors: { primary: "#1E88E5" } }}
              error={confirmPasswordError}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                size={25}
                color="#1E88E5"
              />
            </TouchableOpacity>
          </View>

          <HelperText type="error" visible={confirmPasswordError}>
            Passwords must match
          </HelperText>

          <Divider style={styles.divider} />
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.button}
          >
            Reset Password
          </Button>
        </Card.Content>
      </Card>
    </View>
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
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
});

export default ResetPasswordScreen;
