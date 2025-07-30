import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useRef, useState } from "react";
import { Activity, ActivityCompletion } from "@/types/database.types";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { Text, Surface, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";
import { useColorScheme } from "react-native";

const router = useRouter();

export default function SummaryScreen() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completed, setCompletions] = useState<ActivityCompletion[]>([]);
  const scheme = useColorScheme();

  const swipeabalRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const handelDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("task_id", id);
      if (error) throw error;

      // Refresh the card list after deletion
      const { data } = await supabase.from("activities").select("*");
      if (data) setActivities(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handelComplete = async (id_: string) => {
  //   if (!user?.id || completed?.includes(id_)) return;

  //   const currenDate = new Date().toISOString();
  //   const updates = {
  //     id: id_,
  //     user_id: user.id,
  //     completed_at: currenDate,
  //   };

  //   try {
  //     const { error } = await supabase
  //       .from("activity_completions")
  //       .upsert(updates);
  //     // .eq("task_id", id);
  //     if (error) throw error;

  //     const activity = activities.find((a) => a.task_id === id_);
  //     if (!activity) return;

  //     await supabase
  //       .from("activities")
  //       .update({
  //         streak_count: activity.streak_count + 1,
  //         last_completed: currenDate,
  //       })
  //       .eq("task_id", id_); // Refresh the card list after deletion
  //     const { data } = await supabase.from("activities").select("*");
  //     if (data) setActivities(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleComplete = async (activityId: string) => {
    const currentDate = new Date().toISOString();
    try {
      // 1. Validate user and check if already completed
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user?.id) {
        throw new Error("User not authenticated");
      }

      if (completed?.some((c) => c.id === activityId)) {
        console.log("Activity already completed today");
        return;
      }

      // 2. Record completion
      const { error } = await supabase.from("activity_completions").insert({
        user_id: user.id,
        id: activityId,
        completed_at: currentDate,
      });

      if (error) throw error;

      const activity = activities.find((a) => a.task_id === activityId);
      if (!activity) return;
      // 2.1. update
      await supabase
        .from("activities")
        .update({
          streak_count: activity.streak_count + 1,
          last_completed: currentDate,
        })
        .eq("task_id", activityId);

      // 3. Optimistic UI update
      setCompletions((prev) => [
        ...(prev || []),
        {
          id: activityId, // or let DB generate this
          user_id: user.id,
          // activity_id: activityId,
          completed_at: new Date().toISOString(),
        },
      ]);

      // 4. Refresh data (optional)
      await fetchTodayCompletions();
    } catch (error) {
      console.error("Failed to complete activity:", error);
      // Revert optimistic update if needed
      setCompletions((prev) => prev?.filter((c) => c.id !== activityId) || []);
    }
  };

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"white"}
      ></MaterialCommunityIcons>
    </View>
  );

  const renderRightActions = (id: string) => (
    <View style={styles.swipeActionRight}>
      {isActivityCompleted(id) ? (
        <Text style={{ color: "#fff" }}> Completed</Text>
      ) : (
        <MaterialCommunityIcons
          name="circle-edit-outline"
          size={32}
          color={"white"}
        />
      )}
    </View>
  );

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`activity_updates:${user.id}`) // Unique channel name per user
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`, // Filter for current user only
        },
        (payload) => {
          console.log("Change received:", payload);
          fetchActivities();
        }
      )
      .subscribe();

    const completedChannel = supabase
      .channel(`activity_completions:${user.id}`) // Unique channel name per user
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activity_completions",
          filter: `user_id=eq.${user.id}`, // Filter for current user only
        },
        (payload) => {
          console.log("Change received:", payload);
          fetchTodayCompletions();
        }
      )
      .subscribe();

    // Initial fetch
    fetchActivities();
    fetchTodayCompletions();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(completedChannel);
    };
  }, [user?.id]); // Only re-run if user.id changes

  const fetchActivities = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTodayCompletions = async () => {
    try {
      // 1. Get current user (works with both context and direct auth)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      // 2. Set up date range for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 3. Fetch completions
      const { data, error } = await supabase
        .from("activity_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_at", today.toISOString())
        .lt("completed_at", tomorrow.toISOString()); // More precise than rangeGte

      if (error) throw error;

      // 4. Update state with typed data
      setCompletions(data || []);
    } catch (error) {
      console.error("Error fetching today's completions:", error);
      setCompletions([]); // Reset on error
    }
  };

  const isActivityCompleted = (id: string) => {
    return completed?.some((c) => c.id === id);
  };

  // const isDark = useTheme();
  const isDark = scheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "black" : "#f5f5f5" },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <Text variant="headlineSmall" style={styles.header}>
          Your Activities!
        </Text>
        {activities?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {" "}
              No Cards yet. Add your first Card!{" "}
            </Text>
          </View>
        ) : (
          activities?.map((activity, key) => (
            <Swipeable
              ref={(ref) => {
                swipeabalRefs.current[activity.user_id] = ref;
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={() => renderRightActions(activity.task_id)}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handelDelete(activity.task_id);
                } else if (direction === "right") {
                  handleComplete(activity.task_id);
                }

                swipeabalRefs.current[activity.task_id]?.close();
              }}
            >
              <Surface
                style={[
                  styles.card,
                  { backgroundColor: isDark ? "#0e8a8affff" : "#f5f5f5" },
                  isActivityCompleted(activity?.task_id) &&
                    styles.cardCompleted,
                ]}
                elevation={3}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{activity.title}</Text>
                  <Text style={styles.cardDescription}>
                    {activity.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color={"#ff9800"}
                      ></MaterialCommunityIcons>
                      <Text style={styles.streakText}>
                        {activity.streak_count} day streak
                      </Text>
                    </View>

                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>
                        {activity.frequency.charAt(0).toUpperCase() +
                          activity.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 24,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#bf99d4ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardCompleted: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666666",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});
