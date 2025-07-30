import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { ScrollView } from "react-native-gesture-handler";
import TabOneScreen from "./(tabs)";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Just wait for the auth state change to fire — avoids calling getSession directly
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        {session && session.user ? (
          // <TabOneScreen key={session.user.id} session={session} />
          <Account key={session.user.id} session={session} />
        ) : (
          <Auth />
        )}
      </View>
    </ScrollView>
  );
}
