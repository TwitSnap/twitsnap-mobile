import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para configurar Firebase Messaging y notificaciones locales
const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'default-channel', // ID del canal
      channelName: 'Default Channel', // Nombre del canal
      channelDescription: 'A channel for general notifications', // Descripción del canal
      soundName: 'default', // Sonido por defecto
      importance: PushNotification.Importance.HIGH, // Alta prioridad
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

// Función para guardar notificaciones en AsyncStorage
const saveNotification = async (notification) => {
  try {
    // Obtener notificaciones actuales de AsyncStorage
    const existingNotifications = await AsyncStorage.getItem('notifications');
    const notifications = existingNotifications
      ? JSON.parse(existingNotifications)
      : [];

    // Agregar nueva notificación a la lista
    notifications.push(notification);

    // Guardar la lista actualizada en AsyncStorage
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    console.log('Notification saved successfully:', notification);
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

export const configureNotifications = () => {
  createNotificationChannel();

  messaging().requestPermission();

  // Manejar mensajes cuando la app está en primer plano
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground Message Data:', remoteMessage);

    if (remoteMessage.notification) {
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        receivedAt: new Date().toISOString(),
      };

      // Guardar la notificación en AsyncStorage
      await saveNotification(notification);

      // Mostrar notificación local
      PushNotification.localNotification({
        channelId: 'default-channel',
        title: notification.title,
        message: notification.body,
        data: notification.data,
      });
    }
  });

  // Manejar notificaciones en segundo plano
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background Message:', remoteMessage);

    if (remoteMessage.notification) {
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        receivedAt: new Date().toISOString(),
      };

      // Guardar la notificación en AsyncStorage
      await saveNotification(notification);

      // Mostrar notificación local
      PushNotification.localNotification({
        channelId: 'default-channel',
        title: notification.title,
        message: notification.body,
        data: notification.data,
      });
    }
  });
};
