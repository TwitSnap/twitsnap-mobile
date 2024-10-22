import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";
import {

  Alert,

} from "react-native";

const headers = {
  "Content-Type": "application/json",
};

const GoogleLoginHandler = async (token) => {
  const requestBody = {
    token: token,
  };

  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${GATEWAY_URL}/v1/auth/federate/google/login`, {
        method: "GET",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      const responseString = JSON.stringify(response, null, 2); 

      Alert.alert("Response", responseString);
      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 200:
          const userToken = responseJson.token; 
          await AsyncStorage.setItem("token", userToken);
          return 0; 
        case 400:
          return new Error("Invalid token or user not registered. Please try again.");
        default:
          console.log(`Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`);
          retries++;
      }
    } catch (error) {
      console.log("Error encountered: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached.");
      }
    }
  }
};

export default GoogleLoginHandler;