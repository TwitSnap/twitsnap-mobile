import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const DeletePostHandler = async (postId) => {
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
        `${GATEWAY_URL}/v1/twit/post?post_id=${postId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        },
      );

      if (response.status === 204) {
        return true;
      } else if (response.status === 422) {
        const responseJson = await response.json();
        throw new Error(
          "Validation error: " + JSON.stringify(responseJson.detail),
        );
      } else {
        retries++;
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
      }
    } catch (error) {
      console.log("Error deleting post: ", error);
      retries++;
      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default DeletePostHandler;
