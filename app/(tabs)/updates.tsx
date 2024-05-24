// screens/UpdatesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import channels from "@/utils/channels.json";
import AuthService from "@/services/authService";
import { getAuth } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

/**
 * UpdatesScreen component
 *
 * This component displays the updates screen with a status section and channels to follow.
 *
 * @component
 */
const UpdatesScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { getProfilePictureUrl } = AuthService();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    /**
     * This function fetches the profile picture of the user
     *
     * @returns {void} The result of this function
     */
    const fetchProfilePicture = async () => {
      const url = await getProfilePictureUrl(user?.uid ?? "");
      setProfilePictureUrl(url);
      setLoading(false);
    };

    fetchProfilePicture();
  }, []);

  if (loading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Updates</Text>
      <Text style={styles.subHeader}>Status</Text>
      <View style={styles.statusContainer}>
        {profilePictureUrl && (
          <Image
            style={styles.profileImage}
            source={{ uri: profilePictureUrl }} // Replace with actual image URL
          />
        )}
        <View>
          <Text style={styles.statusText}>My status</Text>
          <Text style={styles.addStatusText}>Add to my status</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons
            name="camera"
            size={24}
            color={currentColors.muted}
            style={{
              marginRight: 30,
              padding: 8,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: currentColors.mainBackground,
            }}
          />
          <Ionicons
            name="pencil-outline"
            size={24}
            color={currentColors.muted}
            style={{
              padding: 8,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: currentColors.mainBackground,
            }}
          />
        </View>
      </View>
      <Text style={styles.subHeader}>Channels</Text>
      <View
        style={{
          backgroundColor: currentColors.secondBackground,
          marginTop: 10,
          paddingHorizontal: 16,
        }}
      >
        <Text style={styles.channelsText}>
          Stay updated on topics that matter to you. Find channels to follow
          below.
        </Text>
        <Text
          style={{ fontSize: 12, marginTop: 25, color: currentColors.gray }}
        >
          Find channels
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={channels}
          keyExtractor={() => "_" + Math.random().toString(36).substr(2, 9)}
          renderItem={({ item }) => (
            <View style={styles.channelCard}>
              <View style={styles.imageContainer}>
                <Image style={styles.channelImage} source={{ uri: item.uri }} />
                <View style={styles.verifiedBadge}>
                  <MaterialIcons
                    name="verified"
                    size={20}
                    color={currentColors.green}
                  />
                </View>
              </View>
              <Text style={styles.channelName}>{item.title}</Text>
              <TouchableOpacity style={styles.followButton}>
                <Text
                  style={{
                    color: currentColors.muted,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Follow
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
        />
        <TouchableOpacity
          style={[
            styles.exploreButton,
            { backgroundColor: currentColors.muted },
          ]}
        >
          <Text style={styles.exploreButtonText}>Explore more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Styles for the UpdatesScreen component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginTop: 110,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 16,
  },
  subHeader: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "white",
    padding: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addStatusText: {
    fontSize: 14,
    color: "gray",
  },
  iconContainer: {
    marginLeft: "auto",
    flexDirection: "row",
    padding: 8,
  },
  channelsText: {
    marginTop: 8,
    color: "gray",
  },
  channelCard: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    width: screenWidth * 0.32,
    marginRight: 10,
    borderWidth: 0.7,
    borderColor: "lightgray",
    height: 160,
  },
  imageContainer: {
    width: 65,
    height: 65,
    position: "relative",
    marginBottom: 8,
  },
  channelImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  verifiedBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    backgroundColor: "white",
    borderRadius: 50,
  },
  channelName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  followButton: {
    marginTop: 8,
    height: 30,
    paddingVertical: 4,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F4FF",
  },
  exploreButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "flex-start", // Center the button
  },
  exploreButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
});

export default UpdatesScreen;
