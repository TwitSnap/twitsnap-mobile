import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { UserProvider } from "./contexts/UserContext";
import * as Linking from "expo-linking";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

const handleDeepLink = (event) => {
  console.log("Deep link received");
  const data = Linking.parse(event.url);
  console.log("Deep link received:", data);
};

const App = () => {
  useEffect(() => {
    Linking.addEventListener("url", handleDeepLink);
    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const linking = {
    prefixes: ["twitsnap://"],
    config: {
      screens: {
        ResetPasswordScreen: {
          path: "reset-password/:token",
          parse: {
            token: (token) => `${token}`,
          },
        },
      },
    },
  };

  return (
    <UserProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
