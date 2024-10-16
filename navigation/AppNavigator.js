
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyPinScreen from '../screens/VerifyPinScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchProfileScreen from '../screens/SearchProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} options={{ headerShown: true, headerTitle: '', }} />
        <Stack.Screen name={"VerifyPinScreen"} component={VerifyPinScreen} options={{ headerShown: true, headerTitle: '', }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: true, headerTitle: '', }} />
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
        <Stack.Screen name={"ProfileScreen"} component={ProfileScreen} options={{ headerShown: true, headerTitle: '', }} />
        <Stack.Screen name={"SearchProfileScreen"} component={SearchProfileScreen} options={{ headerShown: true, headerTitle: '', }} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;
