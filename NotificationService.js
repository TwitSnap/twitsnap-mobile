import messaging from "@react-native-firebase/messaging";

// Función para configurar notificaciones
export const configureNotifications = () => {
  // Solicitar permisos de notificación (solo en iOS)
  messaging().requestPermission();

  // Escuchar notificaciones cuando la app está en primer plano
  messaging().onMessage(async (remoteMessage) => {
    console.log("FCM Message Data:", remoteMessage.data);
  });

  // Si la app está en segundo plano o cerrada, esta función se activa
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Background Message:", remoteMessage.data);
  });
};
