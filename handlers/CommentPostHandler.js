import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const CommentPostHandler = async (body, postId) => {
  let retries = 0;
  const maxRetries = 5;

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

      const response = await fetch(`${GATEWAY_URL}/v1/twit/comment`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ body, post_id: postId }),
      });
      console.log(response);
      if (response.status === 204) {
        return { success: true };
      } else if (response.status === 400) {
        throw new Error("Invalid input data");
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error posting comment: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default CommentPostHandler;
