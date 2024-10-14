import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useGetMessages } from '@/hooks/useGetMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useSocketMessage } from '@/hooks/useSocketMessage';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

const ChatScreen: React.FC = () => {
  const chatUserId = '6707fe5445f0dc6fdde0b347'; // Hardcoded receiver userId
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch initial messages
  const fetchedMessages = useGetMessages(chatUserId);

  // Sync initial messages when fetched
  useEffect(() => {
    setMessages(fetchedMessages);
  }, [fetchedMessages]);

  // Socket message listener
  useSocketMessage((receivedMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  });

  // Sending message hook
  const sendMessage = useSendMessage(chatUserId);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage).then((sentMessage) => {
        setMessages((prevMessages) => [...prevMessages, sentMessage]); // Add sent message to local state
        setNewMessage(''); // Clear input after sending
      });
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === chatUserId ? styles.receivedBubble : styles.sentBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  receivedBubble: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-start',
  },
  sentBubble: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
