import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  accept: "application/json",
};

const GetInterestsHandler = async () => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/interests/`, {
        method: "GET",
        headers: headers,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      return data.interests;
    } catch (error) {
      console.error("Error fetching interests:", error);
      retries++;

      if (retries < maxRetries) {
        console.log(`Retrying... attempt ${retries}`);
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries) * 1000),
        );
      } else {
        throw new Error(
          "Maximum retry attempts reached. Unable to fetch interests.",
        );
      }
    }
  }
};

export default GetInterestsHandler;
