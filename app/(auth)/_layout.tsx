import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: "Enter your credentials to login",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].mainBackground },
          }}
        />
        <Stack.Screen name="register"  options={{
            title: "Create an account",
            headerBackTitle: "Login",
            headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].mainBackground },
          }} />
      </Stack>
    </ThemeProvider>
  );
}
