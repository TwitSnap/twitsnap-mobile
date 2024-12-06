import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Función para configurar Firebase Messaging y notificaciones locales
const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'default-channel', // ID del canal
      channelName: 'Default Channel', // Nombre del canal
      channelDescription: 'A channel for general notifications', // Descripción del canal
      soundName: 'default', // Sonido por defecto
      importance: PushNotification.Importance.HIGH, // Alta prioridad
      vibrate: true, // Vibrar
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

export const configureNotifications = () => {

  createNotificationChannel();

  messaging().requestPermission();

  // Manejar mensajes cuando la app está en primer plano
  messaging().onMessage(async (remoteMessage) => {
    console.log('FCM Message Data:', remoteMessage);

    // Mostrar notificación local si hay datos de notificación
    if (remoteMessage.notification) {
      PushNotification.localNotification({
        channelId: "default-channel",
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        data: remoteMessage.data,
      });
    }
  });

  // Manejar notificaciones en segundo plano
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background Message:', remoteMessage);

    // Mostrar notificación local
    if (remoteMessage.notification) {
      PushNotification.localNotification({
        channelId: "default-channel",
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        data: remoteMessage.data,
      });
    }
  });
};