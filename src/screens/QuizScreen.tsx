import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import questionsData from "../data/questions.json";

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Leaderboard: undefined;
};

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const saveScore = async (name: string, score: number) => {
  const leaderboard = await AsyncStorage.getItem("leaderboard");
  const data = leaderboard ? JSON.parse(leaderboard) : [];
  data.push({ name, score });
  await AsyncStorage.setItem("leaderboard", JSON.stringify(data));
};

// To shuffle question and answer when open quiz
function getRandomQuestions(allQuestions: Question[], count: number) {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => {
    const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
    const shuffledOptions = optionPairs.sort(() => Math.random() - 0.5);
    const newOptions = shuffledOptions.map((pair) => pair.opt);
    const newAnswer = shuffledOptions.findIndex(
      (pair) => pair.idx === q.answer
    );
    return { question: q.question, options: newOptions, answer: newAnswer };
  });
}

const TOTAL_QUESTIONS = 20;

const QuizScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(questionsData, TOTAL_QUESTIONS));
  }, []);

  useEffect(() => {
    if (showResult && !scoreSaved) {
      saveScore("Player", score);
      setScoreSaved(true);
    }
  }, [showResult, score, scoreSaved]);

  const handleOptionPress = (optionIdx: number) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    if (optionIdx === questions[current].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (current + 1 < TOTAL_QUESTIONS) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Your Score: {score} / {TOTAL_QUESTIONS}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Leaderboard")}
        >
          <Text style={styles.buttonText}>Go to Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[current];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {current + 1} / {TOTAL_QUESTIONS}
      </Text>
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>
      {q.options.map((option, idx) => {
        let btnStyle = styles.optionButton;
        if (selected !== null) {
          if (idx === q.answer) btnStyle = styles.correctButton;
          else if (idx === selected) btnStyle = styles.wrongButton;
        }
        return (
          <TouchableOpacity
            key={option}
            style={btnStyle}
            onPress={() => handleOptionPress(idx)}
            disabled={selected !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
  },
  progress: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 16,
  },
  questionBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
  },
  optionButton: {
    backgroundColor: "#e0e7ef",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  correctButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  wrongButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#4064dbff",
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default QuizScreen;
