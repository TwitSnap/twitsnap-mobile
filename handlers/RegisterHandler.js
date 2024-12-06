import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const RegisterHandler = async (
  username,
  email,
  password,
  phone,
  country,
  interests,
) => {
  const requestBody = {
    username: username,
    email: email,
    password: password,
    phone: phone,
    country: country,
    interests: interests,
  };

  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/register/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 201:
          return responseJson;
        case 409:
          return new Error(responseJson.message);
        case 422:
          return new Error(
            "Validation error: " +
              responseJson.detail.map((err) => err.msg).join(", "),
          );
        default:
          console.log(
            `Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error encountered: ", error);
      console.log(`Retrying... attempt ${retries + 1}`);

      retries++;

      if (retries >= maxRetries) {
        throw new Error("Maximum retry attempts reached. ");
      }
    }
  }
};

export default RegisterHandler;
