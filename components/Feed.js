import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Twit from "./Twit"; // Asegúrate de tener el componente Twit importado
import GetFeedHandler from "../handlers/GetFeedHandler"; // Importar el handler

const Feed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPosts = async () => {
    if (feedLoading) return;

    setFeedLoading(true);
    try {
      const userFeed = await GetFeedHandler(offset, limit); // Llamar al handler
      setPosts(userFeed.posts || []); // Guardar los posts del feed
      setHasMore(userFeed.posts.length === limit); // Verificar si hay más posts
      setOffset((prevOffset) => prevOffset + limit); // Actualizar el offset
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setFeedLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const userFeed = await GetFeedHandler(userId, offset, limit); // Llamar al handler para cargar más
      setPosts((prevPosts) => [...prevPosts, ...userFeed.posts]); // Agregar los nuevos posts
      setHasMore(userFeed.posts.length === limit); // Verificar si hay más posts
      setOffset((prevOffset) => prevOffset + limit); // Actualizar el offset
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(); // Cargar los posts al montar el componente
  }, [userId]);

  return (
    <View style={styles.feedContainer}>
      <ScrollView>
        {feedLoading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => <Twit key={post.post_id} post={post} />)
            ) : (
              <Text style={styles.noPostsText}>No posts available</Text>
            )}
            {isLoadingMore && (
              <ActivityIndicator size="small" color="#1E88E5" />
            )}
            {hasMore && !isLoadingMore && (
              <TouchableOpacity onPress={loadMorePosts}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  feedContainer: {
    flex: 1,
    padding: 16,
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
  },
  loadMoreText: {
    textAlign: "center",
    color: "#1E88E5",
    marginVertical: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
};

export default Feed;
