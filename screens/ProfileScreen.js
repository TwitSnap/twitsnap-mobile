import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Text, Card, Button, HelperText, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from "@react-navigation/native";
import {useUser} from "../contexts/UserContext";
import * as ImagePicker from 'expo-image-picker'; 
import fetchUser from "../functions/fetchUser";
import EditMyProfileHandler from "../handlers/EditMyProfileHandler";
import GetProfileHandler from "../handlers/GetProfileHandler";


const ProfileScreen = () => {
    const { userId, allowEdit } = useRoute().params || {};
    const { loggedInUser, setLoggedInUser } = useUser();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState('about:blank');
    const [country, setCountry] = useState('')
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState(username);
    const [newPhoto, setNewPhoto] = useState(photo);
    const [usernameError, setUsernameError] = useState(false);
    const [newCountry, setNewCountry] = useState(country);

    useEffect(() => {
        const loadProfile = async () => {
            if (allowEdit) {
                try {
                    setUsername(loggedInUser.username);
                    setNewUsername(loggedInUser.username);
                    setBio(loggedInUser.description);
                    setPhoto(`${loggedInUser.photo}?timestamp=${new Date().getTime()}`);
                    setNewPhoto(`${loggedInUser.photo}?timestamp=${new Date().getTime()}`);
                    setCountry(loggedInUser.country);
                    setNewCountry(loggedInUser.country);
                } catch (error) {
                    console.error('Failed to load authenticated user profile', error);
                }
            } else {
                try {
                    const data = await GetProfileHandler(userId);
                    if (data) {
                        setUsername(data.username);
                        setBio(data.description);
                        setPhoto(`${data.photo}?timestamp=${new Date().getTime()}` || 'about:blank');
                        setCountry(data.country);
                    } else {
                        return (
                            <View style={styles.container}>
                                <Text>Failed to load user.</Text>
                            </View>
                        );
                    }
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    setBio('Failed to load user.');
                }
            }
            setLoading(false);
        };

        loadProfile();
    }, []);

    if (loading) {
    return <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />;
  }

    const handleSave = async () => {
        if (newUsername.trim() === '') {
            setUsernameError(true);
            return;
        }
        setUsernameError(false);

        try {
            const profileData = await EditMyProfileHandler(newUsername, loggedInUser.phone, newCountry, bio, newPhoto);
            setLoggedInUser(profileData);

            // Have to update it like this instead of using loggedInUser
            // cause value doesn't update until next call.
            setUsername(profileData.username);
            setNewUsername(profileData.username);
            setBio(profileData.description);
            setPhoto(`${profileData.photo}?timestamp=${new Date().getTime()}`);
            setNewPhoto(`${profileData.photo}?timestamp=${new Date().getTime()}`);
            setCountry(profileData.country);
            setNewCountry(profileData.country);

            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Failed to save profile data', error);
            Alert.alert('Error', error.message);
        }
    };

     const handleImagePick = async () => {
        if (editing) {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission denied', 'You need to grant permission to access the gallery.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setNewPhoto(result.assets[0].uri); 
            }
        }
    };

     const handleCancel = () => {
        setEditing(false);
        setNewUsername(username); 
        setBio(loggedInUser.description); 
        setNewCountry(country); 
    };

   if (allowEdit) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleImagePick} style={styles.profileHeader}>
                    <Avatar.Image size={100} source={{uri: editing ? newPhoto : photo}} style={styles.photo}/>
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
                        <Text style={styles.username}>{username}</Text>
                    )}
                </TouchableOpacity>

                <Card style={styles.card}>
                    <Card.Title title="Bio"/>
                    <Card.Content>
                        {editing ? (
                            <TextInput
                                style={styles.input}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                            />
                        ) : (
                            <Text>{bio || 'No bio specified'}</Text>
                        )}
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Country"/>
                    <Card.Content>
                        {editing ? (
                            <TextInput
                                style={styles.input}
                                value={newCountry}
                                onChangeText={setNewCountry}
                                placeholder="Edit Country"
                            />
                        ) : (
                            <Text>{country || 'Country not specified'}</Text> 
                        )}
                    </Card.Content>
                </Card>

                {editing ? (
                      <>
                        <Button mode="contained" onPress={handleSave} style={[styles.saveButton, { marginBottom: 15 }]} >
                            Save
                        </Button>
                        <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button mode="outlined" onPress={() => setEditing(true)} style={styles.editButton}>
                        Edit
                    </Button>
                )}
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleImagePick} style={styles.profileHeader}>
                    <Avatar.Image size={100} source={{uri: photo}} style={styles.photo}/>
                    <Text style={styles.username}>{username}</Text>
                </TouchableOpacity>

                <Card style={styles.card}>
                    <Card.Title title="Bio"/>
                    <Card.Content>
                        <Text>{bio || 'No bio specified'}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Country"/>
                    <Card.Content>
                        <Text>{country || 'Country not specified'}</Text> 
                    </Card.Content>
                </Card>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD',
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    photo: {
        marginBottom: 10,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0D47A1',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderRadius: 4,
        width: '100%',
    },
    editButton: {
        marginTop: 16,
        borderColor: '#1E88E5',
        borderWidth: 1,
    },
    saveButton: {
        marginTop: 16,
        backgroundColor: '#1E88E5',
    },
    messageScreen: {
        flex: 1,
        backgroundColor: '#E3F2FD',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;