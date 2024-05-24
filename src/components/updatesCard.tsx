import { View, Text, StyleSheet } from "react-native";
import React from "react";

const UpdatesCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No recent updates to show right now.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#8E8E93",
  },
});

export default UpdatesCard;