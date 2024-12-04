import { GATEWAY_URL, RETRIES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const CreateChatHandler = async (uid) => {
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

      // Hacer el request a la API
      const response = await fetch(`${GATEWAY_URL}/api/v1/chats/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ uid }), // Agregar el uid en el cuerpo de la solicitud
      });
      console.log("Respuesta de I:", response);
      const responseJson = await response.json();
      console.log("Respuesta de la API:", responseJson);

      // Manejar las respuestas según el código de estado
      switch (response.status) {
        case 200:
          return responseJson; // Devuelve la respuesta exitosa
        case 422:
          throw new Error("Validation error. Por favor revisa el UID enviado.");
        default:
          console.log(
            `Estado inesperado: ${response.status}. Reintentando... intento ${retries + 1}`,
          );
          retries++;
      }
    } catch (error) {
      console.log("Error al crear el chat:", error.message);
      console.log(`Reintentando... intento ${retries + 1}`);

      retries++;
    }

    // Si se alcanzan los reintentos máximos, lanzar error
    if (retries >= maxRetries) {
      throw new Error(
        "Se alcanzó el número máximo de intentos para crear el chat.",
      );
    }
  }
};

export default CreateChatHandler;
