import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Text } from 'react-native';
import ChatRow from '@/components/ChatRow';
import { defaultStyles } from '@/constants/Styles';
import { database } from '../../../firebaseConfig'; 
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { getAuth } from 'firebase/auth';

interface Chat {
  id: string;
  from: string;
  date: number;
  img: string;
  msg: string;
}

interface Message {
  userId: string;
  userName: string;
  createdAt: number;
  text: string;
}

interface ChatData {
  receiverId: string;
  img: string;
  messages: { [key: string]: Message };
}

const NoContactsMessage = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, color: 'gray' }}>No contacts found</Text>
  </View>
);

const Page: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const chatsRef = ref(database, 'chats');
  
    /**
     * This function fetches the chats from the database
     * 
     * @returns {() => void} The unsubscribe function
     */
    const unsubscribe = onValue(chatsRef, (snapshot: DataSnapshot) => {
      const contactsMap: { [key: string]: Chat } = {};
  
      snapshot.forEach((chatSnapshot) => {
        const chatId = chatSnapshot.key as string;
        const chatData = chatSnapshot.val() as ChatData;
        const messages = Object.values(chatData.messages || {}) as Message[];
        const lastMessage = messages[messages.length - 1];
  
        if (lastMessage) {
          const { userId, userName, createdAt, text } = lastMessage;
  
          // Check if the senderId matches the current user's ID
          if (userId === user?.uid) {
            const contactId = chatData.receiverId;
  
            if (!contactsMap[contactId] || contactsMap[contactId].date < createdAt) {
              contactsMap[contactId] = {
                id: chatId,
                from: userName,
                date: createdAt,
                img: chatData.img || '',
                msg: text,
              };
            }
          }
        }
      });
  
      setChats(Object.values(contactsMap));
    });
  
    return () => unsubscribe();
  }, [user]);
  

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 40, flex: 1, backgroundColor: '#fff' }}>
      {chats.length === 0 ? (
        <NoContactsMessage />
      ) : (
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatRow {...item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
          )}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

export default Page;
