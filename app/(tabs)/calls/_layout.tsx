import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const Layout = () => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Calls",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerStyle: {
            backgroundColor: currentColors.secondBackground,
          },
          headerSearchBarOptions: {
            placeholder: "Search",
          },
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="call-outline"
                color={currentColors.primary}
                size={30}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};
export default Layout;
