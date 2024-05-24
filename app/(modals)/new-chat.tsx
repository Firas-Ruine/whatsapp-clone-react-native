import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { database, auth } from '../../firebaseConfig'; 
import { defaultStyles } from '@/constants/Styles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';


const Page = () => {
  const [contacts, setContacts] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const contactsRef = ref(database, 'users');

    const unsubscribe = onValue(contactsRef, (snapshot: DataSnapshot) => {
      const contactsData: any[] = [];
      snapshot.forEach((childSnapshot) => {
        // Check if the uid is not equal to the childSnapshot key
        if (childSnapshot.key !== auth.currentUser?.uid) {
          const contact = childSnapshot.val();
          contactsData.push({
            key: childSnapshot.key,
            value: `${contact.name} (${contact.email})`,
            name: `${contact.name} (${contact.email})`,
            img: contact.profilePicture,
          });
        }
      });

      if (contactsData.length === 0) {
        // If no contacts found, display a message in the middle of the screen
        setContacts([]);
      } else {
        setContacts(contactsData);
      }
    });

    return () => unsubscribe();
  }, []);

  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? 'light'];
  const navigateToChat = (contactId: string) => {
    // Navigate to the chat screen with the contact's ID using Expo Router's router instance
    router.push(`/(tabs)/chats/${contactId}`);
  };

  return (
    <View style={{ flex: 1, paddingTop: 110, backgroundColor: currentColors.secondBackground }}>
      {contacts.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>No contacts found</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <Link href={`/(tabs)/chats/${item.key}`}>
              <View style={styles.listItemContainer}>
                <Image source={{ uri: item.img }} style={styles.listItemImage} />
                <Text style={{ color: currentColors.text }}>{item.value}</Text>
              </View>
            </Link>
          )}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={() => <View style={defaultStyles.separator} />}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={{ color: currentColors.text }}>Contacts</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },

  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  sectionHeaderContainer: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noContactsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page;
