// CreateChatButton.js
import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CreateChatHandler from "../handlers/CreateChatHandler"; // Ajusta la ruta de importación si es necesario
import Ionicons from "react-native-vector-icons/Ionicons"; // Importa el ícono que desees

const CreateChatButton = ({ userId, username, photo }) => {
  const navigation = useNavigation();

  const handleStartChat = async () => {
    try {
      const chat = await CreateChatHandler(userId); // Usamos el userId para crear el chat
      const user = { username, photo, uid: userId };
      navigation.navigate("ChatDetailScreen", { chatId: chat.id, user }); // Redirigir al chat creado
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleStartChat}
      style={{
        marginTop: 10,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="chatbubbles" size={30} color="#1E88E5" />
    </TouchableOpacity>
  );
};

export default CreateChatButton;
