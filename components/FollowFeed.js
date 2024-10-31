import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GetFollowersHandler from "../handlers/GetFollowersHandler";
import GetFollowingHandler from "../handlers/GetFollowingHandler";
import { LIMIT } from "../constants";

const FollowFeed = ({ follow, type, userId, userIdHeader }) => {
  const navigation = useNavigation();
  const [data, setData] = useState(follow);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(follow.length == LIMIT);
  const [offset, setOffset] = useState(LIMIT);

  useEffect(() => {
    if (follow.length > 1) loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      console.log(userId);
      console.log(userIdHeader);
      const response =
        type === "followers"
          ? await GetFollowersHandler(userId, offset, LIMIT, userIdHeader)
          : await GetFollowingHandler(userId, offset, LIMIT, userIdHeader);

      const newData =
        type === "followers" ? response.followers : response.following;

      if (newData.length < LIMIT) {
        setHasMore(false);
      }

      setData((prevData) => [...prevData, ...newData]);

      setOffset(offset + LIMIT);
    } catch (error) {
      console.error("Error loading more data: ", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleProfilePress = (uid) => {
    navigation.navigate({
      name: "ProfileScreen",
      key: uid,
      params: {
        userId: uid,
        key: uid,
      },
    });
  };

  const renderFollow = ({ item }) => (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleProfilePress(item.uid)}
    >
      <Image source={{ uri: item.photo }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.feedContainer}>
      <FlatList
        data={data}
        renderItem={renderFollow}
        keyExtractor={(item) => item.uid.toString()}
        showsVerticalScrollIndicator={false}
      />
      {isLoadingMore && <ActivityIndicator size="small" color="#1E88E5" />}
      {hasMore && !isLoadingMore && (
        <TouchableOpacity onPress={loadMorePosts} style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default FollowFeed;
