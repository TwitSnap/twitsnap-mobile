import { GATEWAY_URL, RETRIES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const VerifyPinHandler = async (user_id, pin) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const token = await AsyncStorage.getItem("token");
      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      const requestBody = JSON.stringify({
        id: user_id,
        pin: pin,
      });

      const response = await fetch(`${GATEWAY_URL}/api/v1/users/confirmation`, {
        method: "POST",
        headers: authHeaders,
        body: requestBody,
      });

      console.log(response);
      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 200:
          return 0;
        case 400:
          throw new Error("Invalid request. Check the user_id.");
        case 404:
          return 1;
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error verifying register pin: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default VerifyPinHandler;
