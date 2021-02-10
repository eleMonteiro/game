import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import Router from './src/router/Router'

export default function App() {
  return (
    <View style={styles.container}>
      <Router />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#feddc7'
  },
});
