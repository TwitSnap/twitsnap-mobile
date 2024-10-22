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
import Comments from "../components/Comments";
import GetPostHandler from "../handlers/GetPostHandler";
import CommentPostHandler from "../handlers/CommentPostHandler";

const TwitScreen = ({ route }) => {
  const {twitId, initialTwit } = route.params;
  const [twit, setTwit] = useState(initialTwit || null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateComments, setUpdateComments] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await GetPostHandler(twitId);
      setTwit(postData);
    } catch (error) {
      console.log("Error loading post: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
  const fetchPostData = async () => {
    if (twit == null) {
      await fetchPost(); 
    }
  };

  fetchPostData();
}, [twitId]); 

useEffect(() => {
    if (twit) { 
      setLoading(false);
    }
}, [twit]); 

  const handleCommentSubmit = async () => {
    if (comment) {
      try {
        await CommentPostHandler(comment, twit.post_id);
        setComment(""); // Limpiar el campo de comentario después de enviar
        setUpdateComments((prev) => !prev);
        twit.comment_ammount++;
      } catch (error) {
        console.error("Error al enviar el comentario: ", error.message);
      }
    }
  };

  if (loading) {
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

      <Comments post={twit}  update={updateComments}/>
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
   noCommentsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});

export default TwitScreen;
