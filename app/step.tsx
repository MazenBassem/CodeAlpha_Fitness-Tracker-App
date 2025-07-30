import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";

export default function StepScreen() {
  const [steps, setSteps] = useState<number | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1); // Last 24 hours

    Pedometer.isAvailableAsync().then(setIsAvailable);

    Pedometer.getStepCountAsync(start, end)
      .then((result) => setSteps(result.steps))
      .catch((err) => console.warn("Pedometer error:", err));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer available: {isAvailable ? "✅ Yes" : "❌ No"}</Text>
      <Text>Steps in last 24h: {steps ?? "Loading..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
    // flex: 1,
    // borderWidth: 4,
  },
});
