import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import CounterScreen from "./CounterScreen";
import RecordsScreen from "./RecordsScreen";

export default function PageViewExample() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1" style={styles.page}>
          <CounterScreen />
        </View>
        <View key="2" style={styles.page}>
          <RecordsScreen />
        </View>
      </PagerView>
      <View style={styles.pagination}>
        <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
        <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "#FFD700",
  },
});
