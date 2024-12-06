import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Twit from "./Twit";
import GetFeedHandler from "../handlers/GetFeedHandler";
import GetPostsByTopicHandler from "../handlers/GetPostsByTopicHandler";

const Feed = ({ userId, selectedTag }) => {
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
      const handler = selectedTag ? GetPostsByTopicHandler : GetFeedHandler;
      const response = selectedTag
        ? await handler(selectedTag, 0, 5)
        : await handler( 0, 5);
      setPosts(response.posts || []);
      setHasMore(response.posts.length === limit);
      setOffset((prevOffset) => prevOffset + limit);
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
      const handler = selectedTag ? GetPostsByTopicHandler : GetFeedHandler;
      const response = selectedTag
        ? await handler(selectedTag, offset, limit)
        : await handler(offset, limit);
      setPosts((prevPosts) => [...prevPosts, ...response.posts]);
      setHasMore(response.posts.length === limit);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPosts([]); // Clear posts when selectedTag or userId changes
    setOffset(0); // Reset offset
    loadPosts();
  }, [userId, selectedTag]);

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
              posts.map((post) => (
                <Twit key={`${post.post_id}-${post.created_by}`} post={post} />
              ))
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