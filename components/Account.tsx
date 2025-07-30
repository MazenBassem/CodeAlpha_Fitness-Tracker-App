import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert, AppState } from "react-native";
import { Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import Avatar from "./Avatar";
import { Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

const router = useRouter();

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [full_name, setFullname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [users, setUsers] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (session) {
      getProfile();
      getAllUsers();
    }
  }, [session]);

  async function getAllUsers() {
    try {
      const { data } = await supabase.from("profiles").select("id");
      setUsers(data ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, full_name, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    full_name,
    avatar_url,
  }: {
    username: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        full_name,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      router.push("/(tabs)");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ borderRadius: "50%" }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, full_name, avatar_url: url });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Full Name"
          value={full_name || ""}
          onChangeText={(text) => setFullname(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode="contained"
          onPress={() =>
            updateProfile({
              username,
              full_name,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button mode="contained" onPress={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </View>
      <View style={styles.verticallySpaced}>{}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    // marginTop: 20,
  },
});
