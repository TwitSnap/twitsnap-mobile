import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Twit from "./Twit"; // Asegúrate de tener el componente Twit importado
import GetUserPostsHandler from "../handlers/GetUserPostsHandler";
import DeletePostHandler from "../handlers/DeletePostHandler";

const MyFeed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [twitsLoading, setTwitsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPosts = async () => {
    if (twitsLoading) return;

    setTwitsLoading(true);
    try {
      const userPosts = await GetUserPostsHandler(userId, 0, 5);
      setPosts(userPosts.posts);
      setHasMore(userPosts.posts.length === limit);
      setOffset(limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setTwitsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const userPosts = await GetUserPostsHandler(userId, offset, limit);
      setPosts((prevPosts) => [...prevPosts, ...userPosts.posts]);
      setHasMore(userPosts.posts.length === limit);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const handleDeleteTwit = async (postId) => {
    try {
      const isDeleted = await DeletePostHandler(postId);
      if (isDeleted) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId),
        );
        loadPosts();
        Alert.alert("Success", "The post has been deleted.");
      } else {
        throw new Error("Failed to delete the post.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while deleting the post",
      );
    }
  };

  return (
    <View style={styles.postsContainer}>
      <ScrollView>
        {twitsLoading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Twit
                  key={post.post_id}
                  post={post}
                  onDelete={handleDeleteTwit}
                />
              ))
            ) : (
              <Text style={styles.noPostsText}>No twits available</Text>
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
  postsContainer: {
    flex: 1,
    padding: 16,
  },
  twitsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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

export default MyFeed;
