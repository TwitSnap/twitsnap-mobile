import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {
  TextInput,
  Title,
  Paragraph,
  Card,
  HelperText,
  Divider,
  Checkbox,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomButton from "../components/CustomButton";
import RegisterHandler from "../handlers/RegisterHandler";
import GetInterestsHandler from "../handlers/GetInterestsHandler";
import CountryPicker from "react-native-country-picker-modal";

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
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const interestsData = await GetInterestsHandler();
        setInterests(interestsData); // Uncomment this when you fetch data
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };
    fetchInterests();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setUsernameError(username === "");
    setEmailError(email === "");
    setEmailFormatError(!isValidEmail(email));
    setPasswordError(password === "");
    setPasswordLengthError(password.length < 8);
    setConfirmPasswordError(password !== confirmPassword);

    if (
      !username ||
      !email ||
      !isValidEmail(email) ||
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
        selectedInterests, // Enviar los intereses seleccionados
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((item) => item !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Title style={styles.title}>Register</Title>
        <Paragraph style={styles.subtitle}>Create a new account</Paragraph>
        <Card style={styles.card}>
          <Card.Content>
            {/* Campos de input para el registro */}
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
            <HelperText type="error" visible={emailError && emailFormatError}>
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
            <View style={styles.inputContainer}>
              <CountryPicker
                countryCode={country}
                withFilter
                withFlag
                withCountryNameButton
                withAlphaFilter
                onSelect={(country) => {
                  setCountry(country.cca2);
                }}
              />
            </View>
            <HelperText type="error" visible={false}>
              Just here for adding space between the 2 inputs.
            </HelperText>
            <Divider style={styles.divider} />

            {/* Sección de selección de intereses */}
            <TouchableOpacity onPress={handleOpenModal}>
              <TextInput
                value={selectedInterests.join(", ")}
                placeholder="Select Interests"
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            <View style={{ marginBottom: 50 }} />
            {/* Modal para mostrar la lista de checkboxes */}
            <Modal
              visible={showModal}
              onRequestClose={handleCloseModal}
              transparent={true}
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Select Interests
                  </Text>

                  {interests.map((interest) => (
                    <View key={interest} style={styles.checkboxContainer}>
                      <Checkbox
                        status={
                          selectedInterests.includes(interest)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => toggleInterest(interest)}
                      />
                      <Paragraph>{interest}</Paragraph>
                    </View>
                  ))}

                  <CustomButton title="Done" onPress={handleCloseModal} />
                </View>
              </View>
            </Modal>

            <Divider style={styles.divider} />

            {/* Password fields */}
            <View style={styles.passwordContainer}>
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
            <HelperText type="error" visible={passwordLengthError}>
              Password must be at least 8 characters
            </HelperText>
            <Divider style={styles.divider} />
            <View style={styles.passwordContainer}>
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
              Passwords do not match
            </HelperText>
            <Divider style={styles.divider} />

            {/* Botón de registro */}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderBottomWidth: 0.2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  divider: {
    marginVertical: 8,
  },
});

export default RegisterScreen;
