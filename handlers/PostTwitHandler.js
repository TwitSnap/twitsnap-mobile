import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const PostTwitHandler = async (body, tags, isPrivate = true) => {
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

      const response = await fetch(`${GATEWAY_URL}/v1/twit`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          body,
          tags,
          is_private: isPrivate,
        }),
      });
      console.log(response);

      switch (response.status) {
        case 204:
          return 0;
        case 400:
          return 1;
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error posting twit: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default PostTwitHandler;
