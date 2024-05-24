import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StatusCard = () => {
  return (
    <View style={styles.statusContainer}>
      <Image source={require("@/assets/images/welcome.png")} style={styles.logo} />
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>My Status</Text>
        <Text style={styles.addToStatus}>Add to my status</Text>
      </View>
      <View style={styles.iconsContainer}>
        <View style={[styles.icon, { right: 20 }]}>
          <Ionicons name="camera" size={24} color="#007AFF" />
        </View>
        <View style={styles.icon}>
          <Ionicons name="pencil" size={24} color="#007AFF" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    width: "100%",
    height: 90,
    backgroundColor: "white",
    marginTop: 50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#8E8E93",
    borderBottomColor: "#8E8E93",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    width: "17%",
    height: "85%",
    borderRadius: 50,
    marginHorizontal: 20,
  },
  textContainer: {
    marginLeft: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "700",
  },
  addToStatus: {
    marginTop: 5,
    fontSize: 14,
    color: "#8E8E93",
  },
  iconsContainer: {
    flexDirection: "row",
    left: 100,
  },
  icon: {
    width: 36,
    height: 36,
    backgroundColor: "#EDEDFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatusCard;