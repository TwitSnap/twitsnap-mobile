import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import FollowUserHandler from "../handlers/FollowUserHandler";
import UnfollowUserHandler from "../handlers/UnfollowUserHandler";
import FollowCount from "./FollowCount";
import { useUser } from "../contexts/UserContext";

const FollowButton = ({
  profileId,
  isFollowing: initialIsFollowing,
  followersCount,
  followingCount,
  isMyProfile,
}) => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState(followersCount);
  const [following, setFollowing] = useState(followingCount);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await UnfollowUserHandler(profileId);
        setFollowers((prevCount) => prevCount - 1);
        setLoggedInUser((prevUser) => ({
          ...prevUser,
          amount_of_following: prevUser.amount_of_following - 1,
        }));
      } else {
        await FollowUserHandler(profileId);
        setFollowers((prevCount) => prevCount + 1);
        setLoggedInUser((prevUser) => ({
          ...prevUser,
          amount_of_following: prevUser.amount_of_following + 1,
        }));
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FollowCount
        followersCount={followers}
        followingCount={following}
        userId={profileId}
        userIdHeader={loggedInUser.uid}
      />
      {!isMyProfile && (
        <Button
          mode="contained"
          onPress={handleFollowToggle}
          loading={loading}
          disabled={loading}
          style={[styles.button, isFollowing ? styles.unfollow : styles.follow]}
          contentStyle={styles.buttonContent}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    width: 120,
    paddingVertical: 1,
  },
  buttonContent: {
    paddingHorizontal: 0,
  },
  follow: {
    backgroundColor: "#1E88E5",
  },
  unfollow: {
    backgroundColor: "#E53935",
  },
});

export default FollowButton;
