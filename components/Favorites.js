import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Twit from "./Twit";
import GetFavoritesHandler from "../handlers/GetFavoritesHandler"; 

const Favorites = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadFavorites = async () => {
  if (favoritesLoading) return;
  setFavoritesLoading(true);
  try {
    
    const response = await GetFavoritesHandler(userId, offset, limit);

 
    const userFavorites = response || []; 

    setFavorites(userFavorites);
    setHasMore(userFavorites.length === limit);
    setOffset(limit);
  } catch (error) {
    console.error("Error fetching favorites:", error);
  } finally {
    setFavoritesLoading(false);
  }
};

const loadMoreFavorites = async () => {
  if (isLoadingMore || !hasMore) return;

  setIsLoadingMore(true);
  try {
    const response = await GetFavoritesHandler(userId, offset, limit);
    const userFavorites = response; 

    setFavorites((prevFavorites) => [
      ...prevFavorites,
      ...userFavorites,
    ]);
    setHasMore(userFavorites.length === limit);
    setOffset((prevOffset) => prevOffset + limit);
  } catch (error) {
    console.error("Error fetching more favorites:", error);
  } finally {
    setIsLoadingMore(false);
  }
};

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  return (
    <View style={styles.favoritesContainer}>
      <ScrollView>
        {favoritesLoading && favorites.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <>
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <Twit key={favorite.post_id} post={favorite} />
              ))
            ) : (
              <Text style={styles.noFavoritesText}>No favorites available</Text>
            )}
            {isLoadingMore && (
              <ActivityIndicator size="small" color="#1E88E5" />
            )}
            {hasMore && !isLoadingMore && (
              <TouchableOpacity onPress={loadMoreFavorites}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  favoritesContainer: {
    flex: 1,
    padding: 16,
  },
  noFavoritesText: {
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
};

export default Favorites;
