import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GetFollowersHandler from "../handlers/GetFollowersHandler";
import GetFollowingHandler from "../handlers/GetFollowingHandler";
import { LIMIT } from "../constants";

const FollowCount = ({
  followersCount,
  followingCount,
  userId,
  userIdHeader,
}) => {
  const navigation = useNavigation();

  const handleFollowersPress = async () => {
    try {
      const data = await GetFollowersHandler(userId, 0, LIMIT, userIdHeader);

      if (data.message) {
        Alert.alert("", "User has to follow you to see his followers", [
          {
            text: "OK",
          },
        ]);
        return;
      }

      navigation.navigate("FollowScreen", {
        userId,
        userIdHeader,
        follow: data.followers,
        type: "followers",
      });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleFollowingPress = async () => {
    try {
      const data = await GetFollowingHandler(userId, 0, LIMIT, userIdHeader);

      if (data.message) {
        Alert.alert("", "User has to follow you to see whom he is following", [
          {
            text: "OK",
          },
        ]);
        return;
      }

      navigation.navigate("FollowScreen", {
        userId,
        userIdHeader,
        follow: data.following,
        type: "following",
      });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.countContainer}
        onPress={handleFollowersPress}
      >
        <Text style={styles.countText}>{followersCount}</Text>
        <Text style={styles.labelText}>Followers</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.countContainer, styles.spacing]}
        onPress={handleFollowingPress}
      >
        <Text style={styles.countText}>{followingCount}</Text>
        <Text style={styles.labelText}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  countContainer: {
    alignItems: "center",
  },
  spacing: {
    marginLeft: 32,
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  labelText: {
    fontSize: 14,
  },
});

export default FollowCount;
