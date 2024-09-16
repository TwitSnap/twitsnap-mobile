import React from 'react';
import { StyleSheet } from 'react-native'; 
import { Button } from 'react-native-paper';

const CustomButton = ({ title, onPress }) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={styles.button}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: '#1E88E5',
  },
});

export default CustomButton;