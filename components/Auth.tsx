import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import { Button, Text, useTheme } from "react-native-paper";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  async function signInWithEmail() {
    setLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);

      return;
    }

    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);

      return;
    }
    setError(null);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error instanceof Error) Alert.alert(error.message);
    if (!session) setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.title} variant="headlineSmall">
          {isSignUp ? "Create Account" : "Welcome Back!"}
        </Text>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {error && (
          <Text style={{ marginBottom: 10, color: theme.colors.error }}>
            {error}
          </Text>
        )}
        <Button
          mode="contained"
          disabled={loading}
          onPress={() => (isSignUp ? signUpWithEmail() : signInWithEmail())}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          mode="text"
          disabled={loading}
          onPress={() => handleSwitchMode()}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
