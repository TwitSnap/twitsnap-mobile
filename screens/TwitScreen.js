import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Twit from "../components/Twit";
import Comment from "../components/Comment";
import GetPostWithCommentsHandler from "../handlers/GetPostWithCommentsHandler";
import CommentPostHandler from "../handlers/CommentPostHandler";

const TwitScreen = ({ route }) => {
  const { twit, username, photo } = route.params;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchPostWithComments = async () => {
    try {
      const postData = await GetPostWithCommentsHandler(twit.post_id);
      setComments(postData.comments || []);
    } catch (error) {
      console.log("Error loading comments: ", error);
    }
  };

  useEffect(() => {
    fetchPostWithComments();
  }, [twit.post_id]);

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

  return (
    <View style={styles.container}>
      <Twit post={twit} username={username} photo={photo} />

      <View style={styles.inputContainer}>
        <TextInput
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
        renderItem={({ item }) => <Comment comment={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
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
    padding: 10,
  },
});

export default TwitScreen;
