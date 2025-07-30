import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
const EXERCISETYPES = ["Move", "calories", "time"];
type Frequency = (typeof FREQUENCIES)[number];
type Exercise = (typeof EXERCISETYPES)[number];

export default function AddActivityScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFreq] = useState<Frequency>("daily");
  const [exercise, setExercise] = useState<Exercise>("time");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) throw new Error("Not authenticated");

      const updates = {
        title,
        description,
        frequency,
        streak_count: 0,
        last_completed: new Date().toISOString(), // ✅ fixed
        created_at: new Date(),
      };

      const { error, data } = await supabase.from("activities").insert(updates); // Add onConflict if needed

      if (error) {
        console.error("Supabase error:", error.message);
      } else {
        console.log("Supabase success:", data);
        router.back();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Add Your Activity!
      </Text>
      <TextInput
        label="Title"
        mode="outlined"
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text variant="labelMedium" style={styles.subHeader}>
        {" "}
        Activity Type
      </Text>
      <View style={styles.freqContainer}>
        <SegmentedButtons
          value={exercise}
          onValueChange={(value) => {
            setExercise(value as Exercise);
          }}
          buttons={EXERCISETYPES.map((exercise) => ({
            value: exercise,
            label: exercise.charAt(0).toUpperCase() + exercise.slice(1),
          }))}
          style={{ marginBottom: 10 }}
        />
        <Text variant="labelMedium" style={styles.subHeader}>
          {" "}
          Frequency
        </Text>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => {
            setFreq(value as Frequency);
          }}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
      >
        Add Activity
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  subHeader: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  freqContainer: {
    marginBottom: 24,
  },
});
