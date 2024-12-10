import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput, List, Text, IconButton, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import UsersSearchHandler from "../handlers/UsersSearchHandler";
import GetUserRecommendationsHandler from "../handlers/GetUserRecommendationsHandler";
import SearchFeed from "../components/SearchFeed";
import useDebounce from "../components/useDebounce";

const usersSearchHandler = new UsersSearchHandler();

const SearchProfileScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [allRecommendedUsers, setAllRecommendedUsers] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const loading = loadingRecommendations || loadingSearch;
  const [searchingPosts, setSearchingPosts] = useState(false); // Nuevo estado
  const debounceTime = 500;
  const debouncedSearchText = useDebounce(searchText, debounceTime);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const recommendations = await GetUserRecommendationsHandler(
          offset,
          limit,
        );
        setAllRecommendedUsers(recommendations);
        setRecommendedUsers((prev) =>
          [...prev, ...recommendations].slice(0, 5),
        );
        setOffset((prev) => prev + limit);
        setLoadingRecommendations(false);
      } catch (error) {
        setLoadingRecommendations(false);
        console.error("Error fetching recommendations:", error);
      }
    };
    if (!searchingPosts) fetchRecommendations();
  }, [searchingPosts]);

  useEffect(() => {
    const handleSearch = async () => {
      setLoadingSearch(true);

      if (debouncedSearchText) {
        try {
          if (!searchingPosts) {
            // Buscar usuarios
            const users =
              await usersSearchHandler.searchUsers(debouncedSearchText);
            setFilteredUsers(users);
          }
        } catch (error) {
          console.error("Error during search:", error);
        }
      } else {
        // Limpiar búsqueda
        if (!searchingPosts) {
          usersSearchHandler.cleanSearch();
          setFilteredUsers([]);
        }
      }

      setLoadingSearch(false);
    };

    handleSearch();
  }, [debouncedSearchText, searchingPosts]);

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

  const toggleSearchType = () => {
    setSearchingPosts((prev) => !prev);
    setFilteredUsers([]);
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={toggleSearchType}
        style={styles.toggleButton}
      >
        {searchingPosts ? "Search Users" : "Search Twits"}
      </Button>

      <TextInput
        label={searchingPosts ? "Search Twits" : "Search Users"}
        value={searchText}
        onChangeText={setSearchText}
        theme={{ colors: { primary: "#1E88E5" } }}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />
      ) : searchingPosts ? (
        // Mostrar tuits encontrados
        <SearchFeed searchQuery={searchText} />
      ) : filteredUsers.length > 0 ? (
        // Mostrar usuarios encontrados
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
                left={() => (
                  <List.Image
                    source={{
                      uri: `${item.photo}?timestamp=${new Date().getTime()}`,
                    }}
                    style={styles.avatar}
                  />
                )}
                style={styles.userItem}
              />
            </TouchableOpacity>
          )}
          style={styles.recommendationsList}
        />
      ) : recommendedUsers.length > 0 ? (
        // Mostrar usuarios recomendados
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
      ) : (
        <Text style={styles.noResultsText}>No results found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
  toggleButton: {
    marginBottom: 10,
    backgroundColor: "#1E88E5",
    width: 150,
    height: 45,
    alignSelf: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SearchProfileScreen;
