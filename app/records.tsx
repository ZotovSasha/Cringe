import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated, Dimensions, PanResponder } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function RecordsScreen() {
  const [records, setRecords] = useState<{ count: number; date: string }[]>([]);
  const translateX = new Animated.Value(0);
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem("records");
      if (storedRecords) {
        const parsedRecords = JSON.parse(storedRecords).filter((record: { count: number }) => record.count > 0);
        setRecords(parsedRecords);
      }
    } catch (error) {
      console.error("Error loading records:", error);
    }
  };

  const clearHistory = async () => {
    Alert.alert("Очистить историю", "Вы уверены, что хотите удалить всю историю?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Да",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("records");
            setRecords([]);
          } catch (error) {
            console.error("Error clearing records:", error);
          }
        },
      },
    ]);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 100) {
        // Плавный возврат влево (к предыдущему экрану)
        Animated.timing(translateX, {
          toValue: screenWidth,
          duration: 300,
          useNativeDriver: true,
        }).start(() => router.back());
      } else {
        // Возврат в исходное положение
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderRecord = ({ item }: { item: { count: number; date: string } }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.count}</Text>
    </View>
  );

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.title}>ИСТОРИЯ КРИНЖА</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Дата и время</Text>
          <Text style={styles.headerCell}>Количество кринжа</Text>
        </View>
        <FlatList data={records} renderItem={renderRecord} keyExtractor={(item, index) => index.toString()} style={styles.list} />
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearButtonText}>Очистить историю</Text>
      </TouchableOpacity>
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.activeDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#555",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  cell: {
    flex: 1,
    color: "#FFF",
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 20,
  },
  clearButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  activeDot: {
    width: 12,
    height: 12,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    marginHorizontal: 6,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginHorizontal: 6,
  },
  list: {
    maxHeight: "100%",
  },
});
