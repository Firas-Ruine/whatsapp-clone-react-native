import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { SegmentedControl } from "@/components/SegmentedControl";
import calls from "@/utils/calls.json";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SwipeableRow from "@/components//SwipeableRow";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const transition = CurvedTransition.delay(100);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("All");
  const [items, setItems] = useState(calls);
  const [isEditing, setIsEditing] = useState(false);
  const editing = useSharedValue(-30);
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const onSegmentChange = (option: string) => {
    setSelectedOption(option);
    if (option === "All") {
      setItems(calls);
    } else {
      setItems(calls.filter((call) => call.missed));
    }
  };

  const removeCall = (toDelete: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(items.filter((item) => item.id !== toDelete.id));
  };

  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  const animatedRowStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const animatedPosition = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.secondBackground }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SegmentedControl
              options={["All", "Missed"]}
              selectedOption={selectedOption}
              onOptionPress={onSegmentChange}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={onEdit}>
              <Text style={{ color: currentColors.primary, fontSize: 18 }}>
                {isEditing ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Animated.View style={[defaultStyles.block]} layout={transition}>
            <Animated.FlatList
              skipEnteringExitingAnimations
              data={items}
              scrollEnabled={false}
              itemLayoutAnimation={transition}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={defaultStyles.separator} />
              )}
              renderItem={({ item, index }) => (
                <SwipeableRow onDelete={() => removeCall(item)}>
                  <Animated.View
                    entering={FadeInUp.delay(index * 20)}
                    exiting={FadeOutUp}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <AnimatedTouchableOpacity
                      style={[animatedPosition, { paddingLeft: 8 }]}
                      onPress={() => removeCall(item)}
                    >
                      <Ionicons
                        name="remove-circle"
                        size={24}
                        color={currentColors.red}
                      />
                    </AnimatedTouchableOpacity>

                    <Animated.View
                      style={[
                        defaultStyles.item,
                        { paddingLeft: 20 },
                        animatedRowStyles,
                      ]}
                    >
                      <Image source={{ uri: item.img }} style={styles.avatar} />

                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: item.missed ? currentColors.red : "#000",
                          }}
                        >
                          {item.name}
                        </Text>

                        <View style={{ flexDirection: "row", gap: 4 }}>
                          <Ionicons
                            name={item.video ? "videocam" : "call"}
                            size={16}
                            color={currentColors.gray}
                          />
                          <Text style={{ color: currentColors.gray, flex: 1 }}>
                            {item.incoming ? "Incoming" : "Outgoing"}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: currentColors.gray }}>
                          {format(item.date, "MM.dd.yy")}
                        </Text>
                        <Ionicons
                          name="information-circle-outline"
                          size={24}
                          color={currentColors.primary}
                        />
                      </View>
                    </Animated.View>
                  </Animated.View>
                </SwipeableRow>
              )}
            />
          </Animated.View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
export default Page;
