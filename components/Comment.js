import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import GetProfileHandler from "../handlers/GetProfileHandler";
import { useNavigation } from "@react-navigation/native";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const Comment = ({ comment }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("about:blank");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(comment);
        const profile = await GetProfileHandler(comment.created_by);
        setUsername(profile.username);
        setPhoto(profile.photo);
      } catch (error) {
        console.log("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [comment.created_by]);

  const handleProfilePress = () => {
    navigation.navigate({
      name: "ProfileScreen",
      key: comment.created_by,
      params: {
        userId: comment.created_by,
        allowEdit: false,
        key: comment.created_by,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!comment) {
    return null;
  }

  const time = formatTimestamp(comment.created_at);

  return (
    <View style={styles.comment}>
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
      <Text style={styles.commentContent}>{comment.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
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
  commentContent: {
    fontSize: 14,
    padding: 5,
    color: "#666",
    marginBottom: 5,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default Comment;
