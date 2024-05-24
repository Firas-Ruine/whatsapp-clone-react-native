import BoxedIcon from "@/components/BoxedIcon";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { View, ScrollView, Text, FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import AuthService from "@/services/authService";
import { Link } from "expo-router";

const colorScheme = useColorScheme();
const currentColors = Colors[colorScheme ?? "light"];
const authentificationService = AuthService();
const Page = () => {
  const devices = [
    {
      name: "Broadcast Lists",
      icon: "megaphone",
      backgroundColor: currentColors.green,
    },
    {
      name: "Starred Messages",
      icon: "star",
      backgroundColor: currentColors.yellow,
    },
    {
      name: "Linked Devices",
      icon: "laptop-outline",
      backgroundColor: currentColors.green,
    },
  ];

  const items = [
    {
      name: "Account",
      icon: "key",
      backgroundColor: currentColors.primary,
    },
    {
      name: "Privacy",
      icon: "lock-closed",
      backgroundColor: "#33A5D1",
    },
    {
      name: "Chats",
      icon: "logo-whatsapp",
      backgroundColor: currentColors.green,
    },
    {
      name: "Notifications",
      icon: "notifications",
      backgroundColor: currentColors.red,
    },
    {
      name: "Storage and Data",
      icon: "repeat",
      backgroundColor: currentColors.green,
    },
  ];

  const support = [
    {
      name: "Help",
      icon: "information",
      backgroundColor: currentColors.primary,
    },
    {
      name: "Tell a Friend",
      icon: "heart",
      backgroundColor: currentColors.red,
    },
  ];

  const onSignOut = () => {
    authentificationService.signOut();
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.secondBackground }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={defaultStyles.block}>
          <FlatList
            data={devices}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />

                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentColors.gray}
                />
              </View>
            )}
          />
        </View>

        <View style={defaultStyles.block}>
          <FlatList
            data={items}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />
                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentColors.gray}
                />
              </View>
            )}
          />
        </View>

        <View style={defaultStyles.block}>
          <FlatList
            data={support}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />

                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentColors.gray}
                />
              </View>
            )}
          />
        </View>

        <TouchableOpacity onPress={onSignOut}>
          <Text
            style={{
              color: currentColors.primary,
              fontSize: 18,
              textAlign: "center",
              paddingVertical: 14,
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Page;
