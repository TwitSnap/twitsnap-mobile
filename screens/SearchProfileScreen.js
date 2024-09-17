import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button, List, Text } from 'react-native-paper';

const SearchProfileScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Lista de usuarios falsos de ejemplo
  const users = [
    'juanperez',
    'mariagonzalez',
    'pablomartinez',
    'lauracruz',
    'danielalvarez',
    'sofiaortiz',
    'alejandrosanchez',
    'isabelramirez',
    'ricardogomez',
    'carolinavazquez'
];

  // Manejar la búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = users.filter(user =>
        user.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  // Seleccionar un usuario
  const handleSelectUser = (username) => {
    console.log('Selected user:', username);
  };

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
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)}>
              <List.Item
                title={item}
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