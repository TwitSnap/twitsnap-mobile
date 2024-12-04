import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

// Handler to fetch user statistics with required parameters
const GetUserStatsFollowHandler = async (from_date, user_id) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      // Retrieve token and user_id for authentication
      const token = await AsyncStorage.getItem("token");
      if (!token || !user_id) {
        throw new Error(
          "User is not authenticated. Token or user_id not found.",
        );
      }

      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
        user_id: user_id,
      };

      const url = `${GATEWAY_URL}/api/v1/users/me/stats?from_date=${from_date}`;

      const response = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

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

export default GetUserStatsFollowHandler;
