import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecordsScreen() {
  const [records, setRecords] = useState<{ count: number; date: string }[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [records]);

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

  const clearHistory = async () => {
    if (records.length === 0) {
      Alert.alert("Нет записей", "История пуста, нечего удалять.");
      return;
    }
  
    Alert.alert(
      "Очистить историю",
      "Вы уверены, что хотите удалить всю историю?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Да",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("records"); 
              setRecords([]);
            } catch (error) {
              console.error("Error clearing AsyncStorage:", error);
              Alert.alert("Ошибка", "Не удалось очистить историю.");
            }
          },
        },
      ]
    );
  };  

  const renderRecord = ({ item }: { item: { count: number; date: string } }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ИСТОРИЯ КРИНЖА</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Дата и время</Text>
          <Text style={styles.headerCell}>Количество кринжа</Text>
        </View>
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          style={styles.list}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.clearButton,
          isPressed && styles.clearButtonPressed,
          records.length === 0 && styles.disabledButton,
        ]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
        onPress={clearHistory}
        disabled={records.length === 0}
      >
        <Text style={styles.clearButtonText}>ОЧИСТИТЬ</Text>
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
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 10,
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
  emptyText: {
    color: "#888",
    textAlign: "center",
    padding: 20,
  },
  clearButton: {
    backgroundColor: "#D9534F",
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
    marginVertical: 10,
  },
  clearButtonPressed: {
    backgroundColor: "#C53B3B",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  list: {
    maxHeight: "100%",
  },
});
