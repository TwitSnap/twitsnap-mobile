import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const GetProfileHandler = async (userId) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const token = await AsyncStorage.getItem("token");

      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${GATEWAY_URL}/api/v1/users/${userId}`, {
        method: "GET",
        headers: authHeaders,
      });

      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 200:
          return responseJson;
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error fetching user profile:", error.message);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetProfileHandler;
