import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, HelperText, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton'; 


const RegisterPinScreen = () => {
  const navigation = useNavigation();
  const [Pin, setPin] = useState('');
  const [PinError, setPinError] = useState(false);

  const handleResetPassword = () => {
    if (!Pin) {
      setPinError(true);
    } else {
      setPinError(false);
      // Acá iría la lógica para enviar el correo de recuperación
      Alert.alert('Success', 'Account registered successfully');
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Confirm registration</Title>
      <Paragraph style={styles.subtitle}>Enter the PIN that was sent to your Pin</Paragraph>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            label="PIN"
            value={Pin}
            onChangeText={setPin}
            theme={{ colors: { primary: '#1E88E5' } }}
            error={PinError}
          />
          <HelperText type="error" visible={PinError}> 
            Pin is required
          </HelperText>
          <Divider style={styles.divider} />
          <CustomButton title="Resend PIN" onPress={handleResetPassword} />
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
  divider: {
    marginVertical: 8,
  },
});

export default RegisterPinScreen;