import React, { useState } from "react";
import { View, StyleSheet, Modal, TextInput } from "react-native";
import { Appbar, IconButton, Title, FAB, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostTwitHandler from "../handlers/PostTwitHandler";
import { Snackbar } from "react-native-paper";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const handleViewProfile = async () => {
    try {
      navigation.navigate("ProfileScreen", { allowEdit: true });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSearchProfile = () => {
    navigation.navigate("SearchProfileScreen");
  };

  const handlePostTwit = async () => {
    try {
      await PostTwitHandler(body, tags.split(","));
      setModalVisible(false);
      setBody("");
      setTags("");
      setSnackbarMessage("Twit published successfully!");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error posting twit:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <IconButton
          icon="account-circle"
          color="#1E88E5"
          size={28}
          onPress={handleViewProfile}
          style={styles.iconButton}
        />
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
        <Title style={styles.title}>Welcome</Title>
      </View>

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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
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
  cancelButton: {
    color: "#757575",
  },
});

export default WelcomeScreen;
