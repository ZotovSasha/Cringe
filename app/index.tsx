import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, PanResponder } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function CounterScreen() {
  const [count, setCount] = useState(0);
  const [records, setRecords] = useState<{ count: number; date: string }[]>([]);
  const translateX = new Animated.Value(0);
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem("records");
        if (storedRecords) setRecords(JSON.parse(storedRecords));
      } catch (error) {
        console.error("Error loading records:", error);
      }
    };
    loadRecords();
  }, []);

  const saveRecords = async (newRecords: { count: number; date: string }[]) => {
    try {
      await AsyncStorage.setItem("records", JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error("Error saving records:", error);
    }
  };

  const handlePress = () => setCount(count + 1);

  const handleReset = () => {
    const date = new Date().toLocaleString();
    const newRecords = [...records, { count, date }];
    setCount(0);
    saveRecords(newRecords);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -100) {
        // Плавное пролистывание влево
        Animated.timing(translateX, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }).start(() => router.push("/records"));
      } else {
        // Возврат на исходную позицию
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.counter}>{count}</Text>
      <TouchableOpacity style={styles.cringeButton} onPress={handlePress}>
        <Text style={styles.cringeText}>CRINGE</Text>
        <Text style={styles.warningSymbol}>⚠️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>СБРОС</Text>
      </TouchableOpacity>
      <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontSize: 72,
    color: "#FFF",
    marginBottom: 20,
  },
  cringeButton: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  cringeText: {
    fontSize: 48,
    color: "#333",
    fontWeight: "bold",
  },
  warningSymbol: {
    fontSize: 128,
    color: "#FFD700",
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginBottom: 50,
  },
  resetButtonText: {
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
});
