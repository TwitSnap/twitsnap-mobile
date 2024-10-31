import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const GetFollowersHandler = async (
  userId,
  offset = 0,
  limit = 10,
  userIdHeader,
) => {
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
        user_id: userIdHeader,
      };

      const response = await fetch(
        `${GATEWAY_URL}/api/v1/users/${userId}/followers?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: authHeaders,
        },
      );
      console.log(response);
      const responseJson = await response.json();
      console.log(responseJson);
      if (response.status === 200) {
        return responseJson;
      } else if (response.status === 409) {
        return responseJson;
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error fetching followers: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetFollowersHandler;
