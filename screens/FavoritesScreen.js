import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Favorites from "../components/Favorites"; 

const FavoritesScreen = ({ route }) => {
  const { userId } = route.params; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Favorites userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default FavoritesScreen;