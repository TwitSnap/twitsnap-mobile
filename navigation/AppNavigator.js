
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} options={{ headerShown: true, headerTitle: '', }} />
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
