import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const colorScheme = useColorScheme();
const currentColors = Colors[colorScheme ?? "light"];

export const defaultStyles = StyleSheet.create({
  block: {
    backgroundColor: currentColors.secondBackground,
    borderRadius: 10,
    marginHorizontal: 14,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: currentColors.gray,
    marginLeft: 50,
  },
});
