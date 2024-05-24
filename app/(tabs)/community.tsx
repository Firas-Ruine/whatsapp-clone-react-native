
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

const Communities = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Communities</Text>
        <Image
          source={require("@/assets/images/communities.jpeg")}
          style={styles.image}
        />
        <Text style={styles.subHeader}>Stay connected with a community</Text>
        <Text style={styles.description}>
          Communities bring members together in topic-based groups. Any
          community you're added to will appear here.
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ New Community</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 40,
    marginLeft: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
  },
  image: {
    width: "90%",
    height: 210,
    alignSelf: "center",
    marginTop: 20,
  },
  subHeader: {
    fontSize: 22,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    color: "rgba(60, 60, 67, 0.6)",
  },
  button: {
    width: "95%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default Communities;