import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Text, Paragraph, Divider } from "react-native-paper";
import GetChatsHandler from "../handlers/GetChatsHandler"; // Ajusta esta importación según tu estructura de carpetas

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Cargar chats al inicio
  useEffect(() => {
    const loadChats = async () => {
      try {
        const fetchedChats = await GetChatsHandler(); // Obtener los chats desde la API
        setChats(fetchedChats);
      } catch (error) {
        console.error("Error al cargar chats:", error.message);
      } finally {
        setLoading(false); // Cambiar a 'false' cuando termine la carga
      }
    };

    loadChats();
  }, []);

  // Manejar la navegación a la pantalla de chat cuando se selecciona un chat
  const handleOpenChat = (chatId, user) => {
    navigation.navigate("ChatDetailScreen", { chatId, user }); // Pasar 'user' como parámetro
  };

  // Renderizar cada ítem de la lista de chats
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleOpenChat(item.id, item.user)} // Pasar el objeto 'user' al navegar
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image source={{ uri: item.user.photo }} style={styles.avatar} />
          <View style={styles.chatInfo}>
            <Title style={styles.username}>{item.user.username}</Title>
            <Paragraph style={styles.lastMessage}>
              {item.last_message ? item.last_message.message : "Sin mensajes"}
            </Paragraph>
          </View>
        </Card.Content>
        <Divider />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : chats.length === 0 ? ( // Si no hay chats, mostrar mensaje
        <View style={styles.emptyContainer}>
          <Text style={styles.noChats}>No chats available</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Fondo suave
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  chatItem: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff", // Fondo blanco para el card
    borderRadius: 10, // Bordes redondeados
    overflow: "hidden", // Evitar que el contenido se salga del card
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Color del texto
  },
  lastMessage: {
    fontSize: 14,
    color: "#777", // Color gris para los mensajes
  },
  noChats: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default ChatListScreen;
