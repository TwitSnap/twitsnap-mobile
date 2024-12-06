import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import GetTrendingTopicsHandler from "../handlers/GetTrendingTopicsHandler";
import Feed from "./Feed";

const TrendingTopics = (userId) => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null); // Estado para el tag seleccionado

  useEffect(() => {
    const loadTrendingTopics = async () => {
      try {
        const topics = await GetTrendingTopicsHandler(0, 10);
        setTrendingTopics(topics);
      } catch (error) {
        console.error("Error fetching trending topics:", error);
      }
    };

    loadTrendingTopics();
  }, []);

  // Manejar selección de un tag
  const handleTagSelect = (topic) => {
    // Si el tag seleccionado es el mismo que el actual, deselecciónalo
    setSelectedTag((prevSelectedTag) => (prevSelectedTag === topic ? null : topic));
  };

  return (
    <View style={styles.container}>
      {/* Contenedor de tags */}
       <Text style={styles.title}>Trending Topics</Text>
      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trendingTopics.map(([topic, count], index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tag,
                selectedTag === topic && styles.selectedTag, // Aplicar estilo si es el seleccionado
              ]}
              onPress={() => handleTagSelect(topic)}
            >
              <Text style={styles.tagText}>
                {topic} ({count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <View style={styles.feedContainer}>
        <Feed userId={userId} selectedTag={selectedTag} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  tagsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
   title: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#0D47A1",
  textAlign: "center", // Centrar horizontalmente
},
  tag: {
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedTag: {
    backgroundColor: "#1565C0", // Cambiar color para el tag seleccionado
  },
  tagText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  feedContainer: {
    flex: 1,
  },
});

export default TrendingTopics;
