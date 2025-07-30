import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/lib/auth-context";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useAuth } from "@/lib/auth-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// const queryClient = new QueryClient();

// function RouteGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { user, isLoadingUser } = useAuth();
//   const segments = useSegments();

//   useEffect(() => {
//     const inAuthGroup = segments[0] === "App";

//     if (!user && !inAuthGroup && !isLoadingUser) {
//       router.replace("/"); /// to be changeddddd
//     } else if (user && inAuthGroup && !isLoadingUser) {
//       router.replace("/");
//     }
//   }, [user, segments]);

//   return <>{children}</>;
// }

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaProvider>
          <AuthProvider>
            {/* <RouteGuard> */}
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </ThemeProvider>
          </AuthProvider>
          {/* </RouteGuard> */}
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
    // </QueryClientProvider>
  );
}
