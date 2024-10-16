import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from "../constants";

const headers = {
  "Content-Type": "application/json",
};

const ListUsersHandler = async ({ username, offset = 0, limit = 10 }) => {
  let allUsers = [];
  let retries = 0;
  const maxRetries = 5;

  if (!username || username.trim() === "") {
    throw new Error("The username parameter is required and cannot be empty.");
  }

  while (retries < maxRetries) {
    try {
      const token = await AsyncStorage.getItem("token");

      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      let url = `${GATEWAY_URL}/api/v1/users/?username=${username}&offset=${offset}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

      const datajson = await response.json();
      console.log(datajson);

      if (response.status === 200) {
        allUsers = datajson;
        return allUsers;
      } else {
        console.log(
          `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
        );
        retries++;
        if (retries >= maxRetries) {
          throw new Error(
            datajson.error || "Failed to fetch users after multiple attempts.",
          );
        }
      }
    } catch (error) {
      console.log("Error fetching users:", error.message);
      retries++;
      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. " + error.message);
      }
      console.log(`Retrying... attempt ${retries + 1}`);
    }
  }
};

export default ListUsersHandler;
