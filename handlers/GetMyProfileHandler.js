import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";
import { Alert } from "react-native";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const GetMyProfileHandler = async () => {
  let retries = 0;
  const maxRetries = RETRIES;
  while (retries < maxRetries) {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated. No token found.");
      }

      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(`${GATEWAY_URL}/api/v1/users/me`, {
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
      console.log("Error fetching user profile: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetMyProfileHandler;
