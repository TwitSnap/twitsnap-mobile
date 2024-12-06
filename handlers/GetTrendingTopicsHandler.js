import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const GetTrendingTopicsHandler = async (offset = 0, limit = 5) => {
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

      const response = await fetch(
        `${GATEWAY_URL}/v1/twit/trending?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: authHeaders,
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      }

      switch (response.status) {
        case 400:
          throw new Error("Invalid request. Check the query parameters.");
        case 401:
          throw new Error("Unauthorized. Token may be expired.");
        case 404:
          throw new Error("Trending topics not found.");
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error fetching trending topics: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetTrendingTopicsHandler;
