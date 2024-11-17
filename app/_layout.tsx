import React from "react";
import { View, StyleSheet } from "react-native";
import PageViewExample from "./PageView";

export default function Layout() {
  return (
    <View style={styles.container}>
      <PageViewExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
