import { GATEWAY_URL, RETRIES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const GetUserRecommendationsHandler = async (offset = 0, limit = 5) => {
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

      // Construir la URL con los parámetros de consulta
      const queryParams = new URLSearchParams({ offset, limit });
      const url = `${GATEWAY_URL}/v1/twit/user/recommendation?${queryParams.toString()}`;

      // Hacer el request a la API
      const response = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

      const responseJson = await response.json();
      console.log("Respuesta de la API:", responseJson);

      // Manejar las respuestas según el código de estado
      switch (response.status) {
        case 200:
          return responseJson; // Devuelve las recomendaciones de usuarios
        default:
          console.log(
            `Estado inesperado: ${response.status}. Reintentando... intento ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error.message);
      retries++;
    }

    // Si se alcanzan los reintentos máximos, lanzar error
    if (retries >= maxRetries) {
      throw new Error(
        "Se alcanzó el número máximo de intentos para obtener las recomendaciones.",
      );
    }
  }
};

export default GetUserRecommendationsHandler;
