import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Twit from "./Twit";
import GetCommentsHandler from "../handlers/GetCommentsHandler";
import DeletePostHandler from "../handlers/DeletePostHandler";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [limit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [postId, setPostId] = useState(
    post.is_retweet ? post.origin_post : post.post_id,
  );

  const calculateHasMore = (comments) => {
    let total = 0;
    if (comments.length == 0) {
      return false;
    }
    if (totalComments == 0) {
      total = post.comment_ammount;
      comments.forEach((comment) => {
        const commentCount = -comment.comment_ammount;
        total += commentCount;
      });
      setTotalComments(total);
    } else {
      total = totalComments;
    }
    console.log(comments.length + offset);
    console.log(total);
    return comments.length + offset < total;
  };

  const loadComments = async () => {
    if (commentsLoading) return;

    setCommentsLoading(true);
    try {
      const fetchedComments = await GetCommentsHandler(postId, 0, 5);
      setComments(fetchedComments || []);
      setOffset(limit);
      setHasMore(calculateHasMore(fetchedComments || []));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const fetchedComments = await GetCommentsHandler(postId, offset, limit);
      setComments((prevComments) => [...prevComments, ...fetchedComments]);
      setHasMore(calculateHasMore(fetchedComments || []));
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleDeleteTwit = async (postId) => {
    try {
      const isDeleted = await DeletePostHandler(postId);
      if (isDeleted) {
        setComments((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId),
        );
        setCommentsLoading(false);
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
    <View style={styles.commentsContainer}>
      <ScrollView>
        {commentsLoading && comments.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Twit
                  key={comment.post_id}
                  post={comment}
                  onDelete={handleDeleteTwit}
                />
              ))
            ) : (
              <Text style={styles.noCommentsText}>No comments available</Text>
            )}
            {isLoadingMore && (
              <ActivityIndicator size="small" color="#1E88E5" />
            )}
            {hasMore && !isLoadingMore && (
              <TouchableOpacity onPress={loadMoreComments}>
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
  commentsContainer: {
    flex: 1,
    padding: 16,
  },
  noCommentsText: {
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

export default Comments;
