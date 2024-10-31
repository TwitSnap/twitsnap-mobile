import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import FollowFeed from "../components/FollowFeed";

const FollowScreen = ({ route }) => {
  const { userId, userIdHeader, follow, type } = route.params;
  const [error, setError] = useState(null);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FollowFeed
        follow={follow}
        type={type}
        userId={userId}
        userIdHeader={userIdHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#E3F2FD",
  },
});

export default FollowScreen;
