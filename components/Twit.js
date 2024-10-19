import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GetProfileHandler from "../handlers/GetProfileHandler";
import LikePostHandler from "../handlers/LikePostHandler";
import RetwitPostHandler from "../handlers/RetwitPostHandler";

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

const Twit = ({ post }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("about:blank");
  const [loading, setLoading] = useState(true);
  const [likeAmount, setLikeAmount] = useState(post.like_ammount);
  const [retwitAmount, setRetwitAmount] = useState(post.retweet_ammount);

  if (!post) {
    return null;
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(post);
        const profile = await GetProfileHandler(post.created_by);
        setUsername(profile.username);
        setPhoto(profile.photo);
      } catch (error) {
        console.log("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [post.created_by]);

  const handleLike = async () => {
    try {
      const response = await LikePostHandler(post.post_id);
      if (response == true) {
        setLikeAmount(likeAmount + 1);
      }
    } catch (error) {
      console.log("Error liking the post:", error.message);
    }
  };

  const handleRetwit = async () => {
    try {
      const response = await RetwitPostHandler(post.post_id);
      if (response == true) {
        setRetwitAmount(retwitAmount + 1);
      }
    } catch (error) {
      console.log("Error liking the post:", error.message);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate({
      name: "ProfileScreen",
      key: post.created_by,
      params: {
        userId: post.created_by,
        allowEdit: false,
        key: post.created_by,
      },
    });
  };

  const handleCommentPress = () => {
    if (post.is_comment && post.origin_post) {
      navigation.navigate("TwitScreen", { twitId: post.origin_post });
    }
  };

  const time = formatTimestamp(post.created_at);

  return (
    <View style={styles.post}>
      {post.is_retweet && <Text style={styles.retweetedText}>Retwited🔁</Text>}
      {post.is_comment && (
        <TouchableOpacity onPress={handleCommentPress}>
          <Text style={styles.commentInfo}>Comment to another post 📩</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleProfilePress}>
        <View style={styles.header}>
          <Image
            source={{ uri: `${photo}?timestamp=${new Date().getTime()}` }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.timestamp}>{time}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.postContent}>{post.message}</Text>
      <View style={styles.commentContainer}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.comment}>{likeAmount}♥</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRetwit}>
          <Text style={styles.comment}>{retwitAmount}🔁</Text>
        </TouchableOpacity>
        <Text style={styles.comment}>{post.comment_ammount}📩</Text>
      </View>
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
});

export default Twit;
