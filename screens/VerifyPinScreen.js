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
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import VerifyRegisterPinHandler from "../handlers/VerifyPinHandler";
import ResendPinHandler from "../handlers/ResendPinHandler";
import requestFCMToken from "./LoginScreen";

const VerifyPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user_id, email } = route.params;
  const [Pin, setPin] = useState("");
  const [PinError, setPinError] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerifyPin = async () => {
    if (!Pin) {
      setPinError(true);
    } else {
      setPinError(false);

      try {
        const result = await VerifyRegisterPinHandler(user_id, Pin);
        if (result == 0) {
          Alert.alert("Success", "Account registered successfully");
          await requestFCMToken();
          navigation.navigate("WelcomeScreen");
        } else {
          Alert.alert(
            "Incorrect PIN",
            "The PIN entered is incorrect. Please check your email and try again.",
          );
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleResendPin = async () => {
    setIsResending(true);
    try {
      // Llamada al handler que reenvía el PIN
      const result = await ResendPinHandler(user_id);
      if (result == 0) {
        Alert.alert("Success", "A new PIN has been sent to your email");
      } else {
        Alert.alert("Sending pin failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsResending(false);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Confirm account</Title>
      <Paragraph style={styles.subtitle}>
        Enter the PIN that was sent to your email: ({email})
      </Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            label="PIN"
            value={Pin}
            onChangeText={setPin}
            theme={{ colors: { primary: "#1E88E5" } }}
            error={PinError}
            keyboardType="numeric"
          />
          <HelperText type="error" visible={PinError}>
            Pin is required
          </HelperText>
          <Divider style={styles.divider} />
          <CustomButton title="Confirm PIN" onPress={handleVerifyPin} />
          <Button
            mode="text"
            onPress={handleResendPin}
            loading={isResending}
            disabled={isResending}
            style={styles.resendButton}
          >
            Resend PIN
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
  resendButton: {
    marginTop: 12,
  },
});

export default VerifyPinScreen;
