import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

const EditMyProfileHandler = async (
  username = undefined,
  phone = undefined,
  country = undefined,
  description = undefined,
  photo = undefined,
  interests = undefined,
  device_token = undefined,
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
      };

      const formData = new FormData();

      if (username) {
        formData.append("username", username);
      }
      if (phone) {
        formData.append("phone", phone);
      }
      if (country) {
        formData.append("country", country);
      }
      if (description) {
        formData.append("description", description);
      }

      if (interests) {
        interests.forEach((interest) => {
          formData.append("interests", interest);
        });
      }

      if (device_token) {
        formData.append("device_token", device_token);
      }

      if (photo) {
        const uriParts = photo.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("photo", {
          uri: photo,
          name: `ima4ge.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      console.log(formData);
      const response = await fetch(`${GATEWAY_URL}/api/v1/users/me`, {
        method: "PATCH",
        headers: authHeaders,
        body: formData,
      });
      console.log(response);
      const responseJson = await response.json();

      if (response.status === 200) {
        return responseJson;
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
      console.log("Error updating user profile: ", error);
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

export default EditMyProfileHandler;
