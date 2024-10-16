import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', { // Cambia 'es-ES' a tu configuración regional preferida
    year: 'numeric',
    month: 'long', // 'short' para abreviado
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Cambia a true si deseas un formato de 12 horas
  });
};

const Twit = ({ post, username, photo }) => {
  if (!post) {
    return null; 
  }

  const time = formatTimestamp(post.created_at);

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{post.message}</Text>
      {/*<View style={styles.likesContainer}>
        //<Text style={styles.likes}>{post.ammount} ❤️</Text> 
      //</View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    flex: 1,
  },
  likesContainer: {
    marginTop: 5,
    marginLeft: 280,
  },
  likes: {
    fontSize: 14,
    color: '#1E88E5', 
  },
});

export default Twit;