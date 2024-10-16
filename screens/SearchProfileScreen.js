import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, List, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import  UsersSearchHandler from '../handlers/UsersSearchHandler';

const SearchProfileScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const usersSearchHandler = useRef(new UsersSearchHandler()).current;

  const handleSearch = async (text) => {
    setSearchText(text);
    setLoading(true); 

    
    
    if (text) {
        const users = await usersSearchHandler.searchUsers(text);
        setFilteredUsers(users);  
    } else {
      usersSearchHandler.cleanSearch();
      setFilteredUsers([]); 
       
    }
    setLoading(false);
  };

  const handleSelectUser = (userId) => {
    navigation.navigate('ProfileScreen', { userId: userId, allowEdit: false });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Search
      </Text>
      <TextInput
        label="Enter username"
        value={searchText}
        onChangeText={handleSearch}
        theme={{ colors: { primary: '#1E88E5' } }}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
              <List.Item
                title={`${item.username}`}
                style={styles.userItem}
                right={(props) => <List.Icon {...props} icon="account" />}
                left={() => <List.Image source={{ uri: item.photo }} style={styles.avatar} />}
              />
            </TouchableOpacity>
          )}
          style={styles.list} 
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
    width: '100%', 
    paddingVertical: 10, 
    marginVertical: 6,
    paddingHorizontal: 0, 
  },
  list: {
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default SearchProfileScreen;