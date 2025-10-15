import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Leaderboard: undefined;
};

type LeaderboardItem = {
  name: string;
  score: number;
  date: string;
};

const LeaderboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await AsyncStorage.getItem("leaderboard");
      const parsed: LeaderboardItem[] = data ? JSON.parse(data) : [];
      // Sort by score DESC
      parsed.sort((a, b) => b.score - a.score);
      setLeaderboard(parsed);
    };
    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
            No scores yet.
          </Text>
        }
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#264fd6ff",
    width: 30,
  },
  name: {
    fontSize: 18,
    flex: 1,
    color: "#222",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
    width: 40,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#4064dbff",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LeaderboardScreen;
