import { GATEWAY_URL, RETRIES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const ResendPinHandler = async (user_id) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const token = await AsyncStorage.getItem("token");
      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${GATEWAY_URL}/api/v1/users/${user_id}/pin`,
        {
          method: "POST",
          headers: authHeaders,
        },
      );

      const responseJson = await response.json();
      console.log(responseJson);
      console.log(response);

      switch (response.status) {
        case 200:
          return 0;
        case 404:
          throw new Error("User not found.");
        case 422:
          throw new Error("Validation error.");
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error resending PIN: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;
    }
    if (retries >= maxRetries) {
      throw new Error("Maximum retry attempts reached. ");
    }
  }
};

export default ResendPinHandler;
