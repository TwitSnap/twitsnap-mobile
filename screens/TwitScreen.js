import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import Twit from "../components/Twit";
import Comment from "../components/Comment";
import GetPostWithCommentsHandler from "../handlers/GetPostWithCommentsHandler";
import CommentPostHandler from "../handlers/CommentPostHandler";

const TwitScreen = ({ route }) => {
  const { twitId } = route.params;
  const [twit, setTwit] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPostWithComments = async () => {
    console.log(twitId);
    try {
      setLoading(true);
      const postData = await GetPostWithCommentsHandler(twitId);
      setTwit(postData);
      console.log(postData);
      setComments(postData.comments || []);
    } catch (error) {
      console.log("Error loading comments: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPostWithComments();
  }, [twitId]);

  const handleCommentSubmit = async () => {
    if (comment) {
      try {
        await CommentPostHandler(comment, twit.post_id);
        await fetchPostWithComments();
        setComment("");
      } catch (error) {
        console.error("Error al enviar el comentario: ", error.message);
      }
    }
  };

  if (loading) {
    // Mostrar un indicador de carga mientras se espera el fetch
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Twit post={twit} />

      <View style={styles.inputContainer}>
        <TextInput
          mode="contained"
          style={styles.input}
          placeholder="Write a comment"
          value={comment}
          onChangeText={setComment}
        />
        <Button
          mode="contained"
          onPress={handleCommentSubmit}
          style={styles.button}
        >
          Comment
        </Button>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.comment_id}
        renderItem={({ item }) => <Twit post={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#E3F2FD",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  noComments: {
    fontStyle: "italic",
    color: "#aaa",
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    padding: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TwitScreen;
