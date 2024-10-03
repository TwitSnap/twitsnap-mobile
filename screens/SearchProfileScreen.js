import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, List, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ListUsersHandler from '../handlers/ListUsersHandler';
import GetProfileHandler from "../handlers/GetProfileHandler";

const SearchProfileScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const allUsers = await ListUsersHandler(); 
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleSelectUser = async (userId) => {
    const profileData = await GetProfileHandler(userId); 
    navigation.navigate('ProfileScreen', { profileData, edit: false });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Search for Profiles
      </Text>
      <TextInput
        label="Enter username"
        value={searchText}
        onChangeText={handleSearch}
        theme={{ colors: { primary: '#1E88E5' } }}
        style={styles.input}
      />
      {filteredUsers.length > 0 && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
              <List.Item
                title={`${item.username}`}
                style={styles.userItem}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#E3F2FD', 
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#E3F2FD', 
  },
  userItem: {
    padding: 10,
    marginVertical: 6,
    width: '100%',
  },
});

export default SearchProfileScreen;