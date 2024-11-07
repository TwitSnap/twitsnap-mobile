import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const FavoritePostHandler = async (postId) => {
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
        `${GATEWAY_URL}/v1/twit/favorite?post_id=${postId}`,
        {
          method: "POST",
          headers: authHeaders,
        },
      );

      console.log(response);
      if (response.status === 204) {
        console.log("Post added to favorites successfully.");
        return true;
      } else if (response.status === 404) {
        console.log("Post not found.");
        return false;
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error adding post to favorites: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default FavoritePostHandler;
