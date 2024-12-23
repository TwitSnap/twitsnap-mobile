import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
};

const LoginHandler = async (email, password) => {
  const requestBody = {
    email: email,
    password: password,
  };

  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${GATEWAY_URL}/v1/auth/login`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 200:
          const token = responseJson.token;
          await AsyncStorage.setItem("token", token);
          return 0;
        case 401:
          return new Error(responseJson.title);
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error encountered: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. ");
      }
    }
  }
};

export default LoginHandler;
