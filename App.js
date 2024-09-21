import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from "./contexts/UserContext";

const App = () => {
  return (
      <UserProvider>
          <NavigationContainer>
              <AppNavigator />
          </NavigationContainer>
      </UserProvider>
  );
};

export default App;
