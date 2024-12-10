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
  Modal,
} from "react-native";
import {
  Text,
  Card,
  Button,
  HelperText,
  Avatar,
  Checkbox,
  Paragraph,
  Appbar,
  Menu,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import EditMyProfileHandler from "../handlers/EditMyProfileHandler";
import GetProfileHandler from "../handlers/GetProfileHandler";
import GetUserStatsHandler from "../handlers/GetUserStatsHandler";
import GetUserStatsFollowHandler from "../handlers/GetUserStatsFollowHandler";
import CustomButton from "../components/CustomButton";
import MyFeed from "../components/MyFeed";
import FollowButton from "../components/FollowButton";
import CreateChatButton from "../components/CreateChatButton";
import CountryPicker, { Flag } from "react-native-country-picker-modal";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { userId } = useRoute().params || {};
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [allowEdit, setAllowEdit] = useState(false);
  const [photo, setPhoto] = useState("about:blank");
  const [country, setCountry] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState(username);
  const [newPhoto, setNewPhoto] = useState(photo);
  const [usernameError, setUsernameError] = useState(false);
  const [newCountry, setNewCountry] = useState(country);
  const [newBio, setNewBio] = useState(bio);
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isEditableLoading, setIsEditableLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ comments: 0, likes: 0, shares: 0 });
  const [showStats, setShowStats] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleStatsPress = async () => {
    const formattedDate = startDate.toISOString().split("T")[0];
    const statsData = await GetUserStatsHandler(formattedDate);
    const statsDataFollow = await GetUserStatsFollowHandler(
      formattedDate,
      loggedInUser?.uid,
    );
    const combinedStats = {
      ...statsData,
      ...statsDataFollow,
    };
    setStats(combinedStats);
    setShowStats(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setStartDate(currentDate);
    setShowPicker(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowStats(false);
  };

  const openFavoritesScreen = () => {
    const idToUse = userId || loggedInUser?.uid;
    if (idToUse) {
      navigation.navigate("FavoritesScreen", { userId: idToUse });
    } else {
      console.log("No user ID available");
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <View style={styles.leftSpace} />
          {allowEdit && (
            <TouchableOpacity onPress={openModal} style={styles.iconContainer}>
              <Ionicons name="stats-chart" size={24} color="#000" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={openFavoritesScreen}
            style={styles.iconContainer}
          >
            <Ionicons name="star" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, allowEdit, userId]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId || userId == loggedInUser.uid) {
        try {
          setAllowEdit(true);
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
          setFollowers(loggedInUser.amount_of_followers);
          setFollowing(loggedInUser.amount_of_following);
          setSelectedInterests(loggedInUser.interests);
          setLoading(false);
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
            setFollowed(data.is_followed_by_me);
            setPhoto(
              `${data.photo}?timestamp=${new Date().getTime()}` ||
                "about:blank",
            );
            if (data.country.length != 2) {
              data.country = "";
            }
            setCountry(data.country);
            setNewCountry(data.country);
            setFollowers(data.amount_of_followers);
            setFollowing(data.amount_of_following);
            setLoading(false);
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

    const getStoredInterests = async () => {
      try {
        const storedInterests = await AsyncStorage.getItem("interests");
        if (storedInterests) {
          setInterests(JSON.parse(storedInterests)); // Convierte de JSON a array
        }
      } catch (error) {
        console.error("Error retrieving interests:", error);
      }
    };

    getStoredInterests();
    loadProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setRefreshKey((prevKey) => prevKey + 1);
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />
    );
  }

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
        selectedInterests.length > 0 ? selectedInterests : undefined,
        undefined,
      );
      console.log(profileData);
      if (profileData.message) {
        Alert.alert("Error", profileData.message);
        setIsEditableLoading(false);
        return;
      }
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
      setSelectedInterests(profileData.interests || []);

      setIsEditableLoading(false);
      setEditingPhoto(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile data", error.message);
      Alert.alert("Error", error.message);
    }
    setIsEditableLoading(false);
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((item) => item !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  if (allowEdit) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Modal con estilo de caja */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>User Stats</Text>

              {/* Selector de fecha dentro del modal */}
              <Text style={styles.datePickerLabel}>Select Start Date:</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {startDate.toDateString()}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              {showStats && (
                <View>
                  <Text>Likes♥: {stats.likes}</Text>
                  <Text>Shares🔁: {stats.shares}</Text>
                  <Text>Comments📩: {stats.comments}</Text>
                  <Text>Followers🧑‍🤝‍🧑: {stats.followers_gained}</Text>
                  <Text>Following🔍: {stats.following_gained}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleStatsPress}
                style={styles.getStatsButton}
              >
                <Text style={styles.getStatsText}>Get Stats</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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

        <FollowButton
          profileId={loggedInUser.uid}
          isFollowing={followed}
          followersCount={followers}
          followingCount={following}
          isMyProfile={true}
        />

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

        {editing ? (
          <>
            {/* Interests section in the Card */}
            <Card style={styles.card}>
              <Card.Title title="Interests" />
              <Card.Content>
                <TouchableOpacity
                  onPress={handleOpenModal}
                  style={styles.interestsTouchable}
                >
                  <TextInput
                    value={selectedInterests.join(", ")}
                    placeholder="Select Interests"
                    editable={false}
                    style={styles.input}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>

            {/* Modal for selecting interests */}
            <Modal
              visible={showModal}
              onRequestClose={handleCloseModal}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Interests</Text>

                  {/* List of interests with checkboxes */}
                  {interests.map((interest) => (
                    <View key={interest} style={styles.checkboxContainer}>
                      <Checkbox
                        status={
                          selectedInterests.includes(interest)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => toggleInterest(interest)}
                      />
                      <Paragraph>{interest}</Paragraph>
                    </View>
                  ))}

                  <CustomButton title="Done" onPress={handleCloseModal} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <>
            {/* Non-editing mode for Interests */}
            <Card style={styles.card}>
              <Card.Title title="Interests" />
              <Card.Content>
                <Text>
                  {selectedInterests.length > 0
                    ? selectedInterests.join(", ")
                    : "No interests specified"}
                </Text>
              </Card.Content>
            </Card>
          </>
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

        <SafeAreaView style={{ flex: 1 }} key={refreshKey}>
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

        <FollowButton
          profileId={userId}
          isFollowing={followed}
          followersCount={followers}
          followingCount={following}
        />

        <CreateChatButton userId={userId} username={username} photo={photo} />

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  datePickerLabel: {
    marginVertical: 10,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginVertical: 10,
  },
  datePickerText: {
    color: "#fff",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    color: "#fff",
  },
  getStatsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  getStatsText: {
    color: "#fff",
  },
  iconContainer: {
    marginRight: 10,
  },
  headerRightContainer: {
    flexDirection: "row",
    width: "100%",
  },
  leftSpace: {
    flex: 1,
  },
  iconContainer: {
    marginRight: -140,
    paddingHorizontal: 140,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default ProfileScreen;
