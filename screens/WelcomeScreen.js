import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  Appbar,
  IconButton,
  Title,
  FAB,
  Button,
  Avatar,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostTwitHandler from "../handlers/PostTwitHandler";
import { Snackbar } from "react-native-paper";
import { useUser } from "../contexts/UserContext";
import Feed from "../components/Feed";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const handleViewProfile = async () => {
    try {
      navigation.navigate("ProfileScreen");
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSearchProfile = () => {
    navigation.navigate("SearchProfileScreen");
  };

  const handlePostTwit = async () => {
    try {
      await PostTwitHandler(body, tags.split(","), isPrivate);
      setModalVisible(false);
      setBody("");
      setTags("");
      setIsPrivate(false);
      setSnackbarMessage("Twit published successfully!");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error posting twit:", error);
    }
  };

  const handleRefreshFeed = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <TouchableOpacity
          onPress={handleViewProfile}
          style={styles.profileHeader}
        >
          <Avatar.Image
            source={{
              uri: `${loggedInUser.photo}?timestamp=${new Date().getTime()}`,
            }}
            style={styles.user}
            size={28}
            onPress={handleViewProfile}
          />
        </TouchableOpacity>
        <IconButton
          icon="magnify"
          color="#1E88E5"
          size={28}
          onPress={handleSearchProfile}
          style={styles.iconButton}
        />
        <IconButton
          icon="logout"
          color="#1E88E5"
          size={28}
          onPress={handleLogout}
          style={styles.iconButton}
        />
      </Appbar.Header>

      <View style={styles.titleContainer}>
        <IconButton
          icon="refresh"
          color="#0D47A1"
          size={30}
          onPress={handleRefreshFeed}
        />
      </View>

      <Feed key={refreshKey} userId={loggedInUser.user_id} />

      <FAB
        style={styles.fab}
        icon="feather"
        color="#FFFFFF"
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="What's happening?"
              value={body}
              onChangeText={setBody}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Tags (separated by commas)"
              value={tags}
              onChangeText={setTags}
            />
            <View style={styles.switchContainer}>
              <Switch value={isPrivate} onValueChange={setIsPrivate} />
              <Text style={styles.switchLabel}>Private</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handlePostTwit}
                style={styles.button}
              >
                Post Twit
              </Button>
              <Button
                mode="text"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
  },
  user: {
    left: 6,
  },
  appbar: {
    backgroundColor: "transparent",
    elevation: 0,
    justifyContent: "space-between",
    width: "100%",
  },
  titleContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#0D47A1",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#1E88E5",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#1E88E5",
  },
  profileHeader: {
    padding: 14,
  },
  cancelButton: {
    color: "#757575",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0D47A1",
  },
});

export default WelcomeScreen;
