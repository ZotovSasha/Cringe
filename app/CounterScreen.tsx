import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from 'expo-navigation-bar'; 

export default function CounterScreen() {
  const [count, setCount] = useState(0);
  const [records, setRecords] = useState<{ count: number; date: string }[]>([]);
  const [cringePressed, setCringePressed] = useState(false);
  const [resetPressed, setResetPressed] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#333"); 
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const loadRecords = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem("records");
      if (storedRecords) {
        const parsedRecords = JSON.parse(storedRecords);
        const filteredRecords = parsedRecords.filter(
          (record: { count: number }) => record.count > 0
        );
        setRecords(filteredRecords);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error loading records:", error);
    }
  };

  useEffect(() => {
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

  const handlePress = () => {
    setCount(count + 1);
  };

  const handleReset = () => {
    const date = new Date().toLocaleString();
    const newRecords = [...records, { count, date }];
    setCount(0);
    saveRecords(newRecords);
    loadRecords();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333" />

      <Text style={styles.counter}>{count}</Text>
      <TouchableOpacity
        style={[styles.cringeButton, cringePressed && styles.cringeButtonPressed]}
        onPress={handlePress}
        onPressIn={() => setCringePressed(true)}
        onPressOut={() => setCringePressed(false)}
        activeOpacity={1}
      >
        <Text style={styles.cringeText}>CRINGE</Text>
        <Image source={require("../assets/images/warning.png")} style={styles.warningSymbol} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.resetButton, resetPressed && styles.resetButtonPressed]}
        onPress={handleReset}
        onPressIn={() => setResetPressed(true)}
        onPressOut={() => setResetPressed(false)}
        activeOpacity={1}
      >
        <Text style={styles.resetButtonText}>СБРОС</Text>
      </TouchableOpacity>

      <View style={styles.pagination}></View>
    </View>
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
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  cringeButtonPressed: {
    backgroundColor: "#FFEC84",
  },
  cringeText: {
    fontSize: 48,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  warningSymbol: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: -30,
  },
  resetButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    marginBottom: 50,
  },
  resetButtonPressed: {
    backgroundColor: "#C53B3B",
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
});
