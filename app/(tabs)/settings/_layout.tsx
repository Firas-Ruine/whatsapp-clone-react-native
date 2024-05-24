import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

const Layout = () => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: currentColors.secondBackground },

          headerSearchBarOptions: {
            placeholder: "Search",
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
