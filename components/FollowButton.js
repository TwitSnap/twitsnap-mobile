import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import FollowUserHandler from '../handlers/FollowUserHandler';
import UnfollowUserHandler from '../handlers/UnfollowUserHandler';

const FollowButton = ({ profileId, isFollowing: initialIsFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await UnfollowUserHandler(profileId);
      } else {
        await FollowUserHandler(profileId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
    button: {
    marginTop: 16,
    borderRadius: 20,
    width: 150,
    paddingVertical: 4,
    alignSelf: 'center', 
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