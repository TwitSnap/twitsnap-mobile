import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Text, Avatar, Card, Button, HelperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from "@react-navigation/native";
import {useUser} from "../contexts/UserContext";
import fetchUser from "../functions/fetchUser";
import EditMyProfileHandler from "../handlers/EditMyProfileHandler";


const ProfileScreen = () => {
    const { profileData, edit } = useRoute().params || {};
    const { loggedInUser } = useUser();
    const [username, setUsername] = useState(profileData?.username || '');;
    const [bio, setBio] = useState(profileData?.description || 'No bio available');
    const [avatar, setAvatar] = useState(profileData?.avatar || 'about:blank');
    const [country, setCountry] = useState(profileData?.country || 'Country not specified')
    const [editing, setEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(username);
    const [newAvatar, setNewAvatar] = useState(avatar);
    const [usernameError, setUsernameError] = useState(false);
    const [newCountry, setNewCountry] = useState(country);

    const handleSave = async () => {
        if (newUsername.trim() === '') {
            setUsernameError(true);
            return;
        }
        setUsernameError(false);

        try {
            await EditMyProfileHandler(newUsername, loggedInUser.phone, newCountry, bio);
            setUsername(newUsername);
            setAvatar(newAvatar);
            setCountry(newCountry); 

            await AsyncStorage.setItem('username', newUsername);
            await AsyncStorage.setItem('bio', bio);
            await AsyncStorage.setItem('avatar', newAvatar);
            await AsyncStorage.setItem('country', newCountry);

            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Failed to save profile data', error);
            Alert.alert('Error', error.message);
        }
    };

    const handleImagePick = () => {
        if (editing) {
            Alert.alert('Info', 'Image picking functionality needs to be implemented.');
        }
    };

   if (edit) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleImagePick} style={styles.profileHeader}>
                    <Avatar.Image size={100} source={{uri: editing ? newAvatar : avatar}} style={styles.avatar}/>
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
                            <Text>{bio}</Text>
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
                            <Text>{country}</Text> 
                        )}
                    </Card.Content>
                </Card>

                {editing ? (
                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                        Save
                    </Button>
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
                    <Avatar.Image size={100} source={{uri: avatar}} style={styles.avatar}/>
                    <Text style={styles.username}>{username}</Text>
                </TouchableOpacity>

                <Card style={styles.card}>
                    <Card.Title title="Bio"/>
                    <Card.Content>
                        <Text>{bio}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Country"/>
                    <Card.Content>
                        <Text>{country}</Text> 
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
    avatar: {
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
});

export default ProfileScreen;