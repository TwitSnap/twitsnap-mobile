import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Twit from "./Twit";
import GetPostsBySearchHandler from "../handlers/GetPostsBySearchHandler";

const SearchFeed = ({ searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPosts = async () => {
    if (isLoading || !searchQuery) return;

    setIsLoading(true);
    try {
      const response = await GetPostsBySearchHandler(searchQuery, 0, limit);
      setPosts(response.posts || []);
      setHasMore(response.posts.length === limit);
      setOffset(limit);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore || !searchQuery) return;

    setIsLoadingMore(true);
    try {
      const response = await GetPostsBySearchHandler(
        searchQuery,
        offset,
        limit,
      );
      setPosts((prevPosts) => [...prevPosts, ...response.posts]);
      setHasMore(response.posts.length === limit);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching more search results:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPosts([]); // Clear posts when searchQuery changes
    setOffset(0); // Reset offset
    if (searchQuery) {
      loadPosts();
    }
  }, [searchQuery]);

  return (
    <View style={styles.feedContainer}>
      <ScrollView>
        {isLoading && posts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Twit key={`${post.post_id}-${post.created_by}`} post={post} />
              ))
            ) : (
              <Text style={styles.noPostsText}>No posts found</Text>
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

export default SearchFeed;
