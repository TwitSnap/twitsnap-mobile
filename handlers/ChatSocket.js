import AsyncStorage from "@react-native-async-storage/async-storage";

class WebSocketManager {
  constructor() {
    this.socket = null;
  }

  async connect() {
    const token = await AsyncStorage.getItem("token");
    this.socket = new WebSocket(
      "wss://twitsnap-gateway-2wy0.onrender.com/api/v1/chats/websocket",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensaje recibido:", data);
      if (this.onMessageReceived) this.onMessageReceived(data);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket cerrado:", event.reason);
    };

    this.socket.onerror = (error) => {
      console.error("Error en WebSocket:", error.message);
    };
  }

  sendAuthToken(token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "authenticate", token }));
    }
  }

  sendMessage(receiverId, message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ receiver_id: receiverId, message }));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  setOnMessageReceived(callback) {
    this.onMessageReceived = callback;
  }
}

export const webSocketManager = new WebSocketManager();
