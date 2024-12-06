import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput, List, Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import UsersSearchHandler from "../handlers/UsersSearchHandler";
import GetUserRecommendationsHandler from "../handlers/GetUserRecommendationsHandler";

const usersSearchHandler = new UsersSearchHandler();

const SearchProfileScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [allRecommendedUsers, setAllRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const recommendations = await GetUserRecommendationsHandler(
          offset,
          limit,
        );
        setAllRecommendedUsers(recommendations);
        setRecommendedUsers((prev) =>
          [...prev, ...recommendations].slice(0, 5),
        );
        setOffset((prev) => prev + limit);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendations();
  }, []);

  const handleSearch = async (text) => {
    setSearchText(text);
    setLoading(true);

    if (text) {
      const users = await usersSearchHandler.searchUsers(text);
      setFilteredUsers(users);
    } else {
      usersSearchHandler.cleanSearch();
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  const handleSelectUser = (userId) => {
    navigation.navigate("ProfileScreen", { userId: userId });
  };

  const getNewRecommendation = async () => {
    try {
      const recommendations = await GetUserRecommendationsHandler(offset, 1);
      setAllRecommendedUsers((prev) => [...prev, ...recommendations]);
      setOffset((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const removeRecommendation = (userId) => {
    setRecommendedUsers((prev) => prev.filter((user) => user.id !== userId));
    setRecommendedUsers((prev) => [
      ...prev,
      ...allRecommendedUsers.slice(6, 7),
    ]);
    getNewRecommendation();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Enter username"
        value={searchText}
        onChangeText={handleSearch}
        theme={{ colors: { primary: "#1E88E5" } }}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />
      ) : (
        <>
          {filteredUsers.length === 0 && recommendedUsers.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommended Users</Text>
              <FlatList
                data={recommendedUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.recommendationItem}>
                    <TouchableOpacity
                      onPress={() => handleSelectUser(item.id)}
                      style={styles.userItemContainer}
                    >
                      <List.Item
                        title={item.username}
                        style={styles.userItem}
                        left={() => (
                          <List.Image
                            source={{
                              uri: `${item.photo}?timestamp=${new Date().getTime()}`,
                            }}
                            style={styles.avatar}
                          />
                        )}
                      />
                    </TouchableOpacity>
                    <IconButton
                      icon="close"
                      size={20}
                      onPress={() => removeRecommendation(item.id)}
                      style={styles.removeButton}
                    />
                  </View>
                )}
                style={styles.recommendationsList}
              />
            </View>
          )}

          {filteredUsers.length > 0 && (
            <View style={styles.filteredContainer}>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectUser(item.uid)}
                    style={styles.recommendationItem}
                  >
                    <List.Item
                      title={item.username}
                      style={styles.userItem}
                      left={() => (
                        <List.Image
                          source={{
                            uri: `${item.photo}?timestamp=${new Date().getTime()}`,
                          }}
                          style={styles.avatar}
                        />
                      )}
                    />
                  </TouchableOpacity>
                )}
                style={styles.recommendationsList}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#E3F2FD",
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#E3F2FD",
  },
  userItem: {
    width: "80%",
    paddingVertical: 10,
    marginVertical: 6,
    paddingHorizontal: 0,
  },
  userItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  list: {
    width: "100%",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  recommendationsContainer: {
    marginBottom: 20,
    width: "100%",
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recommendationsList: {
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10,
  },
  removeButton: {
    alignSelf: "center",
  },
  filteredContainer: {
    marginBottom: 20,
    width: "100%",
  },
  filteredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default SearchProfileScreen;
