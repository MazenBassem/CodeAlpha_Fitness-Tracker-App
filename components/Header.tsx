import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useNavigation, useRouter } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";
import { Session } from "@supabase/supabase-js";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/lib/auth-context";
import Account from "./Account";
import { supabase } from "@/lib/supabase";

const headerImage = require("../assets/images/icon.png");
const notifyImage = require("../assets/images/Notification.png");
const header = require("../assets/images/header.jpg");
const router = useRouter();

export function Header() {
  const { user, session } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const colorScheme = useColorScheme();

  const fetchUser = async () => {
    try {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, updated_at, avatar_url")
        .eq("id", session.user.id)
        .single(); // Use single() since we expect one row

      if (error) throw error;
      if (data) {
        setUsername(data.full_name);
        setUrl(data.avatar_url);
        setDate(new Date(data.updated_at).toLocaleDateString());
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUrl("");
      setUsername(""); // Reset to empty string
      setDate(""); // Reset to empty string
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session]); // Refetch when session changes

  return (
    <View style={styles.header}>
      <ImageContainer session={session} image={"dkk"} />
      <HeaderTitle username={username} date={date} />
      <ImageContainer
        session={session}
        image={notifyImage} // Use require for local images
        height={"50%"}
        width={"50%"}
      />
    </View>
  );
}

const ImageContainer = ({
  session,
  image,
  height,
  width,
}: {
  session: Session | null;
  image: any;
  height?: string;
  width?: string;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.imageContainer}>
      {typeof image === "string" ? (
        <Link href="/App" asChild>
          <Pressable>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="account-outline"
                size={25}
                // color={Colors[colorScheme ?? "dark"].text}
                color={"white"}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
      ) : (
        // <Image
        //   source={{ uri: image }}
        //   style={{ height: "100%", width: "100%", borderRadius: 50 }} // Added borderRadius for avatar styling
        //   resizeMode="cover"
        // />
        <Link href="/(tabs)/summary" asChild>
          <Pressable>
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={"white"}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
        // <Image
        //   source={image}
        //   style={{ height, width, color: "white" }}
        //   resizeMode="contain"
        // />
      )}
    </View>
  );
};

const HeaderTitle = ({
  username,
  date,
}: {
  username: string;
  date: string;
}) => (
  <View style={styles.title}>
    <Text style={styles.bigTitle}>Hi {username || "Guest"}</Text>
    {date && <Text style={styles.smallTitle}>Joined {date}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#455465" },
  header: {
    // borderWidth: 3,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    backgroundColor: "#411a65ff",
  },
  title: {
    color: "white",
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
  },
  bigTitle: { color: "white", fontSize: 16, fontFamily: "Poppins-Medium" },
  smallTitle: {
    color: "white",
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    opacity: 0.6,
  },
  image: { height: "100%", width: "100%" },
  fireImage: { height: 15, width: 15, alignSelf: "center", margin: 5 },
  banner: {
    marginTop: 20,
    padding: 30,
    resizeMode: "contain",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
  },
  bannerContainer: { flex: 1 },
  label: { fontFamily: "Poppins-Medium", fontSize: 20, marginVertical: 10 },
  model: {
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 10,
    height: "75%",
    width: "50%",
    transform: [{ rotateY: "180deg" }],
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 3,
  },
  screen: { margin: "3%" },
  offer: { color: "white", fontFamily: "Poppins-Regular", fontSize: 10 },
  offerText: { color: "white", fontSize: 16, fontFamily: "Poppins-Regular" },

  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  fireContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
