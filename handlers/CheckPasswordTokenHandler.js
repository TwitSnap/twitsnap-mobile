import { GATEWAY_URL, RETRIES } from "../constants";

const headers = {
  "Content-Type": "application/json",
};

const CheckPasswordTokenHandler = async (token) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      const response = await fetch(
        `${GATEWAY_URL}/v1/auth/resetPasswordToken/valid/${token}`,
        {
          method: "GET",
          headers: headers,
        },
      );
      const responseJson = await response.json();
      console.log(responseJson);

      switch (response.status) {
        case 200:
          return responseJson.isValid; // Devuelve true si el token es válido
        case 400:
          return false; // Token inválido o malformado
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

  return false; // Si se agotaron los intentos, asumimos que el token no es válido
};

export default CheckPasswordTokenHandler;
