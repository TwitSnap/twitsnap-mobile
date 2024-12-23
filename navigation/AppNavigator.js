import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VerifyPinScreen from "../screens/VerifyPinScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchProfileScreen from "../screens/SearchProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import TwitScreen from "../screens/TwitScreen";
import FollowScreen from "../screens/FollowScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import ChatListScreen from "../screens/ChatListScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name={"RegisterScreen"}
        component={RegisterScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name={"VerifyPinScreen"}
        component={VerifyPinScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
      <Stack.Screen
        name={"ProfileScreen"}
        component={ProfileScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name={"FollowScreen"}
        component={FollowScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name={"SearchProfileScreen"}
        component={SearchProfileScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name={"TwitScreen"}
        component={TwitScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name={"FavoritesScreen"}
        component={FavoritesScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ChatDetailScreen"
        component={ChatDetailScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
