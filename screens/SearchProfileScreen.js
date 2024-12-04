import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput, List, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import UsersSearchHandler from "../handlers/UsersSearchHandler";
import GetUserRecommendationsHandler from "../handlers/GetUserRecommendationsHandler";

const usersSearchHandler = new UsersSearchHandler();

const SearchProfileScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const recommendations = await GetUserRecommendationsHandler();
        setRecommendedUsers(recommendations);
        setLoading(false);
      } catch (error) {}
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
                  <TouchableOpacity
                    onPress={() => handleSelectUser(item.id)}
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
    width: "100%",
    paddingVertical: 10,
    marginVertical: 6,
    paddingHorizontal: 0,
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
    marginRight: 10,
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
