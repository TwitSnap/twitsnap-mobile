import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const GetPostsByTopicHandler = async (tag, offset = 0, limit = 10) => {
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
        `${GATEWAY_URL}/v1/twit/filter/posts?tag=${encodeURIComponent(tag)}&offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: authHeaders,
        },
      );

      if (response.status === 200) {
        const posts = await response.json();
        console.log("Posts fetched successfully:", posts);
        return posts;
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
      }
    } catch (error) {
      console.log("Error fetching posts by topic: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);
      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
    }
  }
};

export default GetPostsByTopicHandler;
