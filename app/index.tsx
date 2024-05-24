import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import welcomeImage from "@/assets/images/welcome.png";
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from "@/contexts/authContext";
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const WelcomeScreen = () => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const openLink = () => {
    Linking.openURL("https://github.com/FIras-Ruine");
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.secondBackground }]}>
      <Image source={{ uri: welcome_image }} style={styles.welcome} />
      <Text style={[styles.headline, { color: currentColors.text }]}>Welcome to WhatsApp Clone</Text>
      <Text style={[styles.description, { color: currentColors.gray }]}>
        Read our{" "}
        <Text style={{ color: currentColors.primary }} onPress={openLink}>
          Privacy Policy
        </Text>
        . {'Tap "Agree & Continue" to accept the '}
        <Text style={{ color: currentColors.primary }} onPress={openLink}>
          Terms of Service
        </Text>
      </Text>
      <Link href="/(auth)/login" replace asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={[styles.buttonText, { color: currentColors.primary }]}>
            Agree & Continue
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    width: "100%",
    height: 300,
    borderRadius: 60,
    marginBottom: 80,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 50,
  },
  button: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
