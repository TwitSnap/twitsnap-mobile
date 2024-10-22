import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
SafeAreaView,
} from "react-native";
import { Text, Card, Button, HelperText, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import EditMyProfileHandler from "../handlers/EditMyProfileHandler";
import GetProfileHandler from "../handlers/GetProfileHandler";
import GetUserPostsHandler from "../handlers/GetUserPostsHandler";
import CustomButton from "../components/CustomButton";
import Twit from "../components/Twit";
import MyFeed from "../components/MyFeed";
import CountryPicker, { Flag } from "react-native-country-picker-modal";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, allowEdit } = useRoute().params || {};
  const { loggedInUser, setLoggedInUser } = useUser();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("about:blank");
  const [country, setCountry] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [twitsLoading, setTwitsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState(username);
  const [newPhoto, setNewPhoto] = useState(photo);
  const [usernameError, setUsernameError] = useState(false);
  const [newCountry, setNewCountry] = useState(country);
  const [newBio, setNewBio] = useState(bio);
  const [posts, setPosts] = useState([]);
  const [isEditableLoading, setIsEditableLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (allowEdit) {
        try {
          setUsername(loggedInUser.username);
          setNewUsername(loggedInUser.username);
          setBio(loggedInUser.description);
          setNewBio(loggedInUser.description);
          setPhoto(`${loggedInUser.photo}?timestamp=${new Date().getTime()}`);
          setNewPhoto(
            `${loggedInUser.photo}?timestamp=${new Date().getTime()}`,
          );
          if (loggedInUser.country.length != 2) {
            loggedInUser.country = "";
          }
          setCountry(loggedInUser.country);
          setNewCountry(loggedInUser.country);
          setLoading(false);
          //const userPosts = await GetUserPostsHandler(loggedInUser.uid);
          //setPosts(userPosts.posts);
          setTwitsLoading(false);
        } catch (error) {
          console.error("Failed to load authenticated user profile", error);
        }
      } else {
        try {
          const data = await GetProfileHandler(userId);
          if (data) {
            setUsername(data.username);
            setNewUsername(data.username);
            setBio(data.description);
            setNewBio(data.description);
            setPhoto(
              `${data.photo}?timestamp=${new Date().getTime()}` ||
                "about:blank",
            );
            if (data.country.length != 2) {
              data.country = "";
            }
            setCountry(data.country);
            setNewCountry(data.country);
            setLoading(false);
            const userPosts = await GetUserPostsHandler(userId);
            setPosts(userPosts.posts);
            setTwitsLoading(false);
          } else {
            return (
              <View style={styles.container}>
                <Text>Failed to load user.</Text>
              </View>
            );
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          setBio("Failed to load user.");
        }
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />
    );
  }

  const openTwit = (post) => {
    navigation.navigate("TwitScreen", {
      twitId: post.post_id,
    });
  };

  const handleSave = async () => {
    if (newUsername.trim() === "") {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
    setEditing(false);
    setIsEditableLoading(true);
    try {
      const profileData = await EditMyProfileHandler(
        newUsername !== username ? newUsername : undefined,
        undefined,
        newCountry !== country ? newCountry : undefined,
        newBio !== bio ? newBio : undefined,
        editingPhoto ? newPhoto : undefined,
      );
      setLoggedInUser(profileData);

      // Have to update it like this instead of using loggedInUser
      // cause value doesn't update until next call.
      setUsername(profileData.username);
      setNewUsername(profileData.username);
      setBio(profileData.description);
      setNewBio(profileData.description);
      setPhoto(`${profileData.photo}?timestamp=${new Date().getTime()}`);
      setNewPhoto(`${profileData.photo}?timestamp=${new Date().getTime()}`);
      setCountry(profileData.country);
      setNewCountry(profileData.country);

      setIsEditableLoading(false);
      setEditingPhoto(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile data", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleImagePick = async () => {
    if (editing) {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission denied",
          "You need to grant permission to access the gallery.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setEditingPhoto(true);
        setNewPhoto(result.assets[0].uri);
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditingPhoto(false);
    setNewPhoto(photo);
    setNewUsername(username);
    setNewBio(loggedInUser.description);
    setNewCountry(country);
  };

  if (allowEdit) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.profileHeader}
        >
          <Avatar.Image
            size={100}
            source={{ uri: editingPhoto ? newPhoto : photo }}
            style={styles.photo}
          />
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Edit Username"
              />
              <HelperText type="error" visible={usernameError}>
                Username cannot be empty.
              </HelperText>
            </>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.username}>{username}</Text>
              {country && country.length === 2 && (
                <Flag countryCode={country} />
              )}
            </View>
          )}
        </TouchableOpacity>

        <Card style={styles.card}>
          <Card.Title title="Bio" />
          <Card.Content>
            {editing ? (
              <TextInput
                style={styles.input}
                value={newBio}
                onChangeText={setNewBio}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text>{bio || "No bio specified"}</Text>
            )}
          </Card.Content>
        </Card>

        {editing && (
          <Card style={styles.card}>
            <Card.Title title="Country" />
            <Card.Content>
              <CountryPicker
                countryCode={newCountry}
                withFilter
                withFlag
                withCountryNameButton
                withAlphaFilter
                onSelect={(country) => {
                  setNewCountry(country.cca2);
                }}
              />
            </Card.Content>
          </Card>
        )}

        {isEditableLoading ? ( // Si está cargando, mostrar ActivityIndicator
          <ActivityIndicator size="large" color="#1E88E5" />
        ) : editing ? ( // Si no está cargando y está en modo edición, mostrar los botones
          <>
            <CustomButton
              title="Save"
              onPress={handleSave}
              loading={loading}
              style={[styles.saveButton, { marginBottom: 15 }]}
            />
            <Button
              mode="contained"
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </>
        ) : (
          <CustomButton
            title="Edit"
            onPress={() => setEditing(true)}
            style={styles.editButton}
          />
        )}

         <SafeAreaView style={{ flex: 1 }}>
          <MyFeed userId={loggedInUser.uid} />
        </SafeAreaView>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.profileHeader}
        >
          <Avatar.Image
            size={100}
            source={{ uri: photo }}
            style={styles.photo}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.username}>{username}</Text>
            {country && country.length === 2 && <Flag countryCode={country} />}
          </View>
        </TouchableOpacity>

        <Card style={styles.card}>
          <Card.Title title="Bio" />
          <Card.Content>
            <Text>{bio || "No bio specified"}</Text>
          </Card.Content>
        </Card>

        <SafeAreaView style={{ flex: 1 }}>
          <MyFeed userId={userId} />
        </SafeAreaView>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  photo: {
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D47A1",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    width: "100%",
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: "#db4a39",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#1E88E5",
  },
  messageScreen: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  postsContainer: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    marginTop: 20,
    width: "100%",
    borderRadius: 8,
    flex: 1,
  },
  postsHeader: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  post: {
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
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  twitsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#0D47A1",
  },
  postContent: {
    fontSize: 14,
    color: "#666",
  },
  noPostsText: {
    textAlign: "center",
    color: "#999",
  },
});

export default ProfileScreen;
