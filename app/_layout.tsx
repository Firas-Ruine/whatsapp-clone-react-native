import React, { useContext, useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext, AuthProvider } from "@/contexts/authContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded");
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthChecker />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/new-chat"
            options={{
              presentation: "modal",
              title: "New Chat",
              headerTransparent: true,
              headerBlurEffect: "regular",
              headerStyle: {
                backgroundColor: currentColors.secondBackground,
              },
              headerRight: () => (
                <Link href={"/(tabs)/chats"} asChild>
                  <TouchableOpacity
                    style={{
                      backgroundColor: currentColors.lightGray,
                      borderRadius: 20,
                      padding: 4,
                    }}
                  >
                    <Ionicons name="close" color={currentColors.gray} size={30} />
                  </TouchableOpacity>
                </Link>
              ),
              headerSearchBarOptions: {
                placeholder: "Search name or number",
                hideWhenScrolling: false,
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AuthChecker = () => {
  const { user, initialized } = useContext(AuthContext);

  useEffect(() => {
    console.log("Checking auth state:", { initialized, user });
    if (!initialized) {
      console.log("Auth not initialized");
      return;
    }
    if (user) {
      console.log("User logged in, redirecting to updates");
      router.push("/(tabs)/updates");
    } else {
      console.log("User not logged in, redirecting to login");
      router.push("/");
    }
  }, [initialized, user]);

  return null;
};
