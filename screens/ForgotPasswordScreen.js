import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card,
  HelperText,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      setEmailError(true);
    } else {
      setEmailError(false);
      // Aquí iría la lógica para enviar el correo de recuperación
      Alert.alert(
        "Success",
        "Check your email for instructions to reset your password.",
      );
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Forgot Password</Title>
      <Paragraph style={styles.subtitle}>
        Enter your email to receive password reset instructions
      </Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={setEmail}
            theme={{ colors: { primary: "#1E88E5" } }}
            error={emailError}
          />
          <HelperText type="error" visible={emailError}>
            Email is required
          </HelperText>
          <Divider style={styles.divider} />
          <CustomButton
            title="Send Reset Instructions"
            onPress={handleResetPassword}
          />
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
});

export default ForgotPasswordScreen;
