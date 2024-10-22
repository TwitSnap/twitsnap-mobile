import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
};

const UpdatePasswordHandler = async (token, newPassword) => {
  const requestBody = {
    token: token,
    newPassword: newPassword,
  };

  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${GATEWAY_URL}/v1/auth/password`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      console.log(response);

      switch (response.status) {
        case 204:
          return response;
        case 401:
          return response;
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

export default UpdatePasswordHandler;
