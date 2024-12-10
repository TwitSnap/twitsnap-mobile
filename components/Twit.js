import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LikePostHandler from "../handlers/LikePostHandler";
import RetwitPostHandler from "../handlers/RetwitPostHandler";
import Icon from "react-native-vector-icons/FontAwesome";
import FavoritePostHandler from "../handlers/FavoritePostHandler";
import EditPostHandler from "../handlers/EditPostHandler";
import DeletePostHandler from "../handlers/DeletePostHandler";
import { useUser } from "../contexts/UserContext";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    // Cambia 'es-ES' a tu configuración regional preferida
    year: "numeric",
    month: "long", // 'short' para abreviado
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Cambia a true si deseas un formato de 12 horas
  });
};

const Twit = ({ post, onDelete }) => {
  const navigation = useNavigation();
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [likeAmount, setLikeAmount] = useState(post.like_ammount);
  const [liked, setLiked] = useState(post.liked);
  const [retwited, setRetwited] = useState(post.retweeted);
  const [retwitAmount, setRetwitAmount] = useState(post.retweet_ammount);
  const [isFavorited, setIsFavorited] = useState(post.favourite);
  const [modalVisible, setModalVisible] = useState(false);
  const [body, setBody] = useState(post.message);
  const [tags, setTags] = useState(post.tags || "");
  const [isPrivate, setIsPrivate] = useState(post.is_private);

  if (!post) {
    return null;
  }

  const mentionRegex = /(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+)/g;

  // Function to render post content with highlighted mentions
  const renderContentWithMentions = (content) => {
    const parts = content.split(mentionRegex); // Split text by mentions
    return parts.map((part, index) => {
      if (mentionRegex.test(part)) {
        return (
          <Text key={index} style={styles.mentionText}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const handleDeleteTwit = async () => {
    // Llamamos a la función onDelete pasándole el post_id para eliminarlo
    if (onDelete) {
      onDelete(post.post_id);
    } else {
      try {
        const isDeleted = await DeletePostHandler(post.post_id);
        if (isDeleted) {
          navigation.goBack();
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
    }
  };

  const handleEditTwit = async () => {
    try {
      const isSuccessful = await EditPostHandler(post.post_id, body, tags);

      if (!isSuccessful) {
        throw new Error("Failed to update the post.");
      }

      post.message = body;
      post.tags = tags;
      post.is_private = isPrivate;

      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while editing the post",
      );
    }
  };

  const handleLike = async () => {
    try {
      const response = await LikePostHandler(post.post_id);
      if (response === true) {
        if (liked) {
          // Ya estaba "liked", así que elimina el like
          setLikeAmount(likeAmount - 1);
          setLiked(false);
          post.like_ammount--;
          post.liked = false;
        } else {
          // No estaba "liked", así que agrega el like
          setLikeAmount(likeAmount + 1);
          setLiked(true);
          post.like_ammount++;
          post.liked = true;
        }
      }
    } catch (error) {
      console.log("Error liking the post:", error.message);
    }
  };
  const handleRetwit = async () => {
    try {
      const response = await RetwitPostHandler(post.post_id);
      if (response == true) {
        if (retwited) {
          setRetwitAmount(retwitAmount - 1);
          setRetwited(false);
          post.retweet_ammount--;
          post.retweeted = false;
        } else {
          setRetwitAmount(retwitAmount + 1);
          setRetwited(true);
          post.retweet_ammount++;
          post.retweeted = true;
        }
      }
    } catch (error) {
      console.log("Error liking the post:", error.message);
    }
  };

  const handleOpenTwit = () => {
    navigation.navigate({
      name: "TwitScreen",
      key: post.post_id,
      params: {
        twitId: post.post_id,
        initialTwit: post,
      },
    });
  };

  const handleFavorite = async () => {
    if (isFavorited == true) return;
    try {
      const response = await FavoritePostHandler(post.post_id);
      if (response == true) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.log("Error favoriting the post:", error.message);
    }
  };

  const handleCommentPress = () => {
    if (post.is_comment && post.origin_post) {
      navigation.navigate({
        name: "TwitScreen",
        key: post.origin_post,
        params: {
          twitId: post.origin_post,
        },
      });
    }
  };

  const handleProfilePress = () => {
    navigation.navigate({
      name: "ProfileScreen",
      key: post.created_by,
      params: {
        userId: post.created_by,
        key: post.created_by,
      },
    });
  };

  const time = formatTimestamp(post.created_at);

  const canEdit = loggedInUser?.uid === post.created_by;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.post}>
      <TouchableOpacity onPress={handleOpenTwit}>
        {post.is_private && (
          <Icon name="lock" size={18} color="#000" style={styles.lockIcon} />
        )}

        {post.is_retweet && (
          <Text style={styles.retweetedText}>Retwited🔁</Text>
        )}
        {post.is_comment && (
          <TouchableOpacity onPress={handleCommentPress}>
            <Text style={styles.commentInfo}>Comment to another post 📩</Text>
          </TouchableOpacity>
        )}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={{
                uri: `${post.photo_creator}?timestamp=${new Date().getTime()}`,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.username_creator}</Text>
            <Text style={styles.timestamp}>{time}</Text>
          </View>
        </View>

        <Text style={styles.postContent}>
          {renderContentWithMentions(post.message)}
        </Text>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <Text style={styles.tagsText}>
            {post.tags.map((tag) => `#${tag.trim()}`).join(" ")}
          </Text>
        )}

        <View style={styles.commentContainer}>
          <TouchableOpacity onPress={handleLike}>
            <Text style={styles.comment}>
              {likeAmount}{" "}
              <Icon
                name={liked ? "heart" : "heart-o"}
                size={18}
                color={liked ? "#FF0000" : "#1E88E5"}
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRetwit}>
            <Text style={styles.comment}>
              {retwitAmount}{" "}
              <Icon
                name="retweet"
                size={18}
                color={retwited ? "#1DB954" : "#1E88E5"}
              />
            </Text>
          </TouchableOpacity>
          <Text style={styles.comment}>
            {post.comment_ammount} <Icon name="comment" size={18} />
          </Text>
          {canEdit && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.editButton}
            >
              <Icon name="pencil" size={18} color="#1E88E5" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleFavorite} style={styles.favorite}>
            <Icon
              name={isFavorited ? "star" : "star-o"}
              size={18}
              color="#FFD700"
            />
          </TouchableOpacity>
        </View>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.input}
                placeholder="Edit message"
                value={body}
                onChangeText={setBody}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Tags (separated by commas)"
                value={tags}
                onChangeText={setTags}
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleEditTwit}
                  style={styles.button}
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  onPress={handleDeleteTwit}
                  style={[styles.button, { backgroundColor: "red" }]}
                >
                  Delete
                </Button>
                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "column",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  postContent: {
    fontSize: 14,
    padding: 5,
    color: "#666",
    marginBottom: 5,
  },
  commentContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  comment: {
    fontSize: 18,
    color: "#1E88E5",
    marginRight: 15,
  },
  commentLike: {
    fontSize: 18,
    color: "#1E88E5",
    marginRight: 5,
  },
  retweetedText: {
    fontSize: 12,
    color: "#1E88E5",
    marginBottom: 5,
    fontStyle: "italic",
    alignSelf: "flex-start",
  },
  commentInfo: {
    fontSize: 12,
    color: "#FF5733",
    marginBottom: 5,
    fontStyle: "italic",
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  favorite: {
    marginLeft: "auto",
    paddingLeft: 15,
  },
  editButton: {
    marginLeft: "auto",
    paddingLeft: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#1E88E5",
  },
  profileHeader: {
    padding: 14,
  },
  cancelButton: {
    color: "#757575",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0D47A1",
  },
  icon: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  deleteButton: {
    color: "#FF0000",
  },
  mentionText: {
    color: "#1E88E5", // You can customize the color of mentions
    fontWeight: "bold",
  },
  tagsText: {
    fontSize: 12,
    color: "#1E88E5", // Azul
    marginTop: 5,
  },
});

export default Twit;
