import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LandingPage({ navigation }) {
  const handlePress = () => {
    navigation.replace('Map');  // Navigate to Map Screen after pressing the button
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Interactive Hotel Map</Text>
      <Text style={styles.description}>
        Find the best hotels around you with ease. Discover ratings, reviews, and more.
      </Text>
      <Button title="Enter" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
});
