import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, HelperText, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    let valid = true;
    if (!email) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }
     if (valid) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'WelcomeScreen' }],
          });}
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.image} />
      <Title style={styles.title}>TwitSnap</Title>
      <Paragraph style={styles.subtitle}>Please enter your credentials</Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={setEmail}
            theme={{ colors: { primary: '#1E88E5' } }}
            error={emailError}
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
            secureTextEntry
            theme={{ colors: { primary: '#1E88E5' } }}
            error={passwordError}
          />
          <HelperText type="error" visible={passwordError}>
            Password is required
          </HelperText>
          <Divider style={styles.divider} />
          <CustomButton title="Login" onPress={handleLogin} />
          <Button mode="text" onPress={handleRegister} style={styles.registerButton}>
            Don't have an account? Register
          </Button>
          <Button mode="text" onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
            Forgot Password?
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#0D47A1',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#0D47A1',
  },
  card: {
    padding: 16,
    elevation: 4,
    backgroundColor: '#d4e6f1',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1E88E5',
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