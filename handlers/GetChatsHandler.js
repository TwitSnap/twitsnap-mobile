import { GATEWAY_URL, RETRIES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const GetChatsHandler = async (limit = 5, offset = 0) => {
  let retries = 0;
  const maxRetries = RETRIES;

  while (retries < maxRetries) {
    try {
      // Obtener el token desde AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      // Construir la URL con parámetros de consulta
      const queryParams = new URLSearchParams({ limit, offset }).toString();
      const url = `${GATEWAY_URL}/api/v1/chats/?${queryParams}`;

      // Hacer el request a la API
      const response = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

      console.log("Respuesta de la API:", response);
      const responseJson = await response.json();
      console.log("Respuesta de la API:", responseJson);

      // Manejar las respuestas según el código de estado
      switch (response.status) {
        case 200:
          return responseJson; // Devuelve la lista de chats
        case 422:
          throw new Error(
            "Validation error. Verifica los parámetros enviados.",
          );
        default:
          console.log(
            `Estado inesperado: ${response.status}. Reintentando... intento ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error al obtener los chats:", error.message);
      console.log(`Reintentando... intento ${retries + 1}`);

      retries++;
    }

    // Si se alcanzan los reintentos máximos, lanzar error
    if (retries >= maxRetries) {
      throw new Error(
        "Se alcanzó el número máximo de intentos para obtener los chats.",
      );
    }
  }
};

export default GetChatsHandler;
