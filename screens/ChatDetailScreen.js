import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";
import {
  Card,
  Button,
  TextInput,
  Text,
  Title,
  Paragraph,
  Avatar,
} from "react-native-paper";
import { webSocketManager } from "../handlers/ChatSocket";
import GetChatMessagesHandler from "../handlers/GetChatMessagesHandler";
import { useUser } from "../contexts/UserContext";

// Función para formatear el timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ChatDetailScreen = ({ route }) => {
  const { chatId, user } = route.params; // Obtener chatId y usuario desde los parámetros de navegación
  const { loggedInUser } = useUser(); // Obtener el usuario actual desde el contexto
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Manejar eventos del teclado
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Cargar los mensajes del chat y configurar WebSocket
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { messages: fetchedMessages } =
          await GetChatMessagesHandler(chatId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error al cargar los mensajes:", error.message);
      }
    };

    loadMessages();

    const initializeWebSocket = () => {
      webSocketManager.connect();
      console.log(user);
      webSocketManager.setOnMessageReceived((message) => {
        if (message.chat_id === chatId) {
          setMessages((prevMessages) => {
            const updatedMessages = [
              {
                id: message.id, // Identificador único
                message: message.message, // Contenido del mensaje
                sender_id: message.sender_id, // ID del remitente
                timestamp: Date.now(), // Timestamp actual
              },
              ...prevMessages, // Agrega los mensajes anteriores después del nuevo
            ];
            //console.log("Estado actualizado de mensajes:", updatedMessages); // Log del nuevo estado
            return updatedMessages;
          });
          //console.log("Mensaje recibido desde WebSocket:", message);
        }
      });
    };

    initializeWebSocket();

    return () => {
      webSocketManager.close();
    };
  }, [chatId]);

  // Enviar un mensaje
  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    webSocketManager.sendMessage(user.uid, messageText);
    setMessageText("");
  };

  // Renderizar mensajes
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender_id === loggedInUser.uid; // Comparar ID del remitente con el usuario actual
    const formattedTime = formatTimestamp(item.timestamp);
    const avatarUri = isCurrentUser
      ? `${loggedInUser.photo}?timestamp=${new Date().getTime()}`
      : `${user.photo}?timestamp=${new Date().getTime()}`;

    const username = isCurrentUser ? loggedInUser.username : user.username;

    return (
      <Card
        style={[
          styles.messageCard,
          isCurrentUser ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Card.Content>
          <View style={styles.messageHeader}>
            <Avatar.Image size={40} source={{ uri: avatarUri }} />
            <View style={styles.messageHeaderText}>
              <Title style={styles.senderName}>{username}</Title>
              <Text style={styles.timestamp}>{formattedTime}</Text>
            </View>
          </View>
          <Paragraph>{item.message}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        inverted
      />
      <View
        style={[
          styles.inputContainer,
          keyboardVisible && styles.inputContainerWithKeyboard,
        ]}
      >
        <TextInput
          label="Escribe un mensaje"
          value={messageText}
          onChangeText={setMessageText}
          mode="outlined"
          style={styles.textInput}
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          style={styles.sendButton}
        >
          Enviar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  messageCard: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  myMessage: {
    backgroundColor: "#e1ffc7",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  messageHeaderText: {
    marginLeft: 10,
  },
  senderName: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  inputContainerWithKeyboard: {
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 5,
    backgroundColor: "#1E88E5",
  },
});

export default ChatDetailScreen;
