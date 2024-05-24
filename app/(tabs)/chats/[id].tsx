// ChatScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRoute } from "@react-navigation/native";
import { database } from "../../../firebaseConfig";
import {
  ref,
  onValue,
  push,
  serverTimestamp,
  DataSnapshot,
} from "firebase/database";
import ChatMessageBox from "@/components/ChatMessageBox";
import ReplyMessageBar from "@/components/ReplyMessageBar";
import { Swipeable } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];
  const route = useRoute();
  const { id } = route.params as { id: string };
  const auth = getAuth();
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");

  const contactsRef = ref(database, `users`);

  /**
   * This function fetches the user name from the database
   * 
   * @returns {() => void} The unsubscribe function
   */
  useEffect(() => {
    const unsubscribe = onValue(contactsRef, (snapshot: DataSnapshot) => {
      snapshot.forEach((childSnapshot) => {
        // Check if the uid is not equal to the childSnapshot key
        if (childSnapshot.key === auth.currentUser?.uid) {
          const contact = childSnapshot.val();
          setUserName(contact.name);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  /**
   * This function fetches the messages from the database
   * 
   * @returns {() => void} The unsubscribe function
   */
  useEffect(() => {
    const messagesRef = ref(database, `chats/${id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesList: IMessage[] = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        messagesList.push({
          _id: childSnapshot.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.userId,
            name: message.userName,
          },
        });
      });
      setMessages(messagesList.reverse());
    });

    return () => unsubscribe();
  }, [id]);

  /**
   * This function sends a message to the database
   * 
   * @param {IMessage[]} messages - The messages to send
   * 
   * @returns {void} The result of this function
   */
  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      const newMessage = messages[0];
      const messagesRef = ref(database, `chats/${id}/messages`);

      await push(messagesRef, {
        text: newMessage.text,
        createdAt: serverTimestamp(),
        userId: newMessage.user._id,
        userName: newMessage.user.name,
      });

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [id]
  );

  /**
   * This function renders the input toolbar
   * 
   * @param props - The props to render
   * @returns 
   */
  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{ backgroundColor: currentColors.secondBackground }}
      renderActions={() => (
        <View
          style={{
            height: 44,
            justifyContent: "center",
            alignItems: "center",
            left: 5,
          }}
        >
          <Ionicons name="add" color={currentColors.primary} size={28} />
        </View>
      )}
    />
  );

  /**
   * This function updates the row reference
   * 
   * @param ref - The reference to update
   * 
   * @returns {void} The result of this function
   */
  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  /**
   * This function closes the swipeable row
   * 
   * @returns {void} The result of this function
   */
  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  return (
    <ImageBackground
      source={require("@/assets/images/pattern.png")}
      style={{
        flex: 1,
        backgroundColor: currentColors.secondBackground,
        marginBottom: insets.bottom,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        onInputTextChanged={setText}
        user={{ _id: user?.uid ?? "", name: userName }}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: currentColors.gray }} />
        )}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={[
          styles.composer,
          { borderColor: currentColors.lightGray },
        ]}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: { color: "#000" } }}
            wrapperStyle={{
              left: { backgroundColor: "#fff" },
              right: { backgroundColor: currentColors.lightGreen },
            }}
          />
        )}
        renderSend={(props) => (
          <View
            style={{
              height: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              paddingHorizontal: 14,
            }}
          >
            {text === "" && (
              <>
                <Ionicons
                  name="camera-outline"
                  color={currentColors.primary}
                  size={28}
                />
                <Ionicons
                  name="mic-outline"
                  color={currentColors.primary}
                  size={28}
                />
              </>
            )}
            {text !== "" && (
              <Send {...props} containerStyle={{ justifyContent: "center" }}>
                <Ionicons name="send" color={currentColors.primary} size={28} />
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={() => (
          <ReplyMessageBar
            clearReply={() => setReplyMessage(null)}
            message={replyMessage}
          />
        )}
        onLongPress={(context, message) => setReplyMessage(message)}
        renderMessage={(props) => (
          <ChatMessageBox
            {...props}
            setReplyOnSwipeOpen={setReplyMessage}
            updateRowRef={updateRowRef}
          />
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
});

export default ChatScreen;
