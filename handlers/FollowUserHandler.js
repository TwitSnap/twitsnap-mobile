import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const FollowUserHandler = async (userId) => {
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
        user_id: userId,
      };

      const requestBody = {
        id: userId,
      };

      const response = await fetch(`${GATEWAY_URL}/api/v1/users/me/following`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(requestBody),
      });
      console.log(response);
      if (response.status === 204) {
        return { success: true };
      } else if (response.status === 422) {
        const errorDetail = await response.json();
        throw new Error(
          "Validation error: " + JSON.stringify(errorDetail.detail),
        );
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error following user: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default FollowUserHandler;
