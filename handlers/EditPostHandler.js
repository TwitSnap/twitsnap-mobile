import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const EditPostHandler = async (postId, body, tags) => {
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
        "Content-Type": "application/json",
      };

      const payload = {
        post_id: postId,
        body: body,
        tags: tags,
      };

      const response = await fetch(`${GATEWAY_URL}/v1/twit/post`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      console.log(response);
      if (response.status === 204) {
        return true;
      } else if (response.status === 422) {
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
      console.log("Error editing post: ", error);
      const message =
        error.response?.data?.error ||
        error.message ||
        "Service is not available at the moment";
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default EditPostHandler;
