import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

// Handler to fetch user statistics in a specified period
const GetUserStatsHandler = async (period) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      // Retrieve token for authentication
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated. No token found.");
      }

      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${GATEWAY_URL}/v1/twit/user/stats?period=${period}`,
        {
          method: "GET",
          headers: authHeaders,
        },
      );
      console.log(response);
      const responseJson = await response.json();
      console.log(responseJson);
      if (response.status === 200) {
        return responseJson; // Successfully retrieved user statistics
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error fetching user stats: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetUserStatsHandler;
