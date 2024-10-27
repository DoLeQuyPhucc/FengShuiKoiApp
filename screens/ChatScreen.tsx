import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // For the back button
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '@/api/axiosInstance';

interface Message {
  _id: string;
  senderId: string;
  message: string;
  timestamp: Date;
}

interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const [processedMessageIds] = useState(new Set<string>());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [queuePosition, setQueuePosition] = useState<QueuePosition | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string>("6707fe5445f0dc6fdde0b347");
  const [isMessageSending, setIsMessageSending] = useState(false);
  const socketRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottom();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        scrollToBottom();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!inQueue && isConnected) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [inQueue, isConnected]);

  useEffect(() => {
    const initializeChat = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);

      // Check for existing session
      const storedSessionId = await AsyncStorage.getItem('currentChatSession');
      if (storedSessionId) {
        setChatSessionId(storedSessionId);
        setInQueue(false);
      }

      socketRef.current = io('https://fengshuikoiapi.onrender.com', {
        query: { 
          userId: storedUserId,
          sessionId: storedSessionId
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
        if (!storedSessionId) {
          socketRef.current.emit('joinQueue', { userId: storedUserId });
        } else {
          socketRef.current.emit('rejoinSession', {
            userId: storedUserId,
            sessionId: storedSessionId
          });
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      socketRef.current.on('reconnect', () => {
        console.log('Reconnected to socket server');
        if (chatSessionId) {
          socketRef.current.emit('rejoinSession', {
            userId: storedUserId,
            sessionId: chatSessionId
          });
        }
      });

      socketRef.current.on('queuePosition', (data: QueuePosition) => {
        setInQueue(true);
        setQueuePosition(data);
      });

      socketRef.current.on('chatStart', async (data: { sessionId: string }) => {
        console.log('Chat started:', data.sessionId);
        setInQueue(false);
        setChatSessionId(data.sessionId);
        await AsyncStorage.setItem('currentChatSession', data.sessionId);
      });

      socketRef.current.on('newMessage', (message: Message) => {
        console.log('New message received:', message);
        
        if (message.senderId !== userId) {
          // Generate a unique identifier for the message
          const messageId = message._id || 
            `${message.senderId}_${message.message}_${new Date(message.timestamp).getTime()}`;
          
          // Kiểm tra xem tin nhắn đã được xử lý chưa
          if (!processedMessageIds.has(messageId)) {
            processedMessageIds.add(messageId);
            
            setMessages(prev => {
              // Kiểm tra xem tin nhắn đã tồn tại trong state chưa
              const messageExists = prev.some(existingMsg => {
                if (existingMsg._id && message._id) {
                  return existingMsg._id === message._id;
                }
                
                // Nếu không có _id, so sánh nội dung và thời gian
                const timeEqual = Math.abs(
                  new Date(existingMsg.timestamp).getTime() - 
                  new Date(message.timestamp).getTime()
                ) < 1000;
                
                return existingMsg.senderId === message.senderId && 
                       existingMsg.message === message.message && 
                       timeEqual;
              });
      
              if (messageExists) {
                return prev;
              }
      
              return [...prev, message];
            });
          }
        }
      });

      socketRef.current.on('chatEnd', async () => {
        await AsyncStorage.removeItem('currentChatSession');
        setChatSessionId(null);
        setMessages([]);
        setInQueue(false);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        processedMessageIds.clear();
      };
    };

    initializeChat();

    loadPreviousMessages();

  }, []);

  const loadPreviousMessages = async () => {
    setIsLoadingMessages(true);    
    try {
      const response = await axiosInstance.get(`/messages/get/${adminId}`);
      const messages = response.data;
      
      // Reset processed message IDs
      processedMessageIds.clear();
      
      // Add all loaded message IDs to processed set
      messages.forEach((msg: Message) => {
        const messageId = msg._id || 
          `${msg.senderId}_${msg.message}_${new Date(msg.timestamp).getTime()}`;
        processedMessageIds.add(messageId);
      });
      
      setMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !adminId) return;

    const messageData = {
      _id: Date.now().toString(),
      senderId: userId as string,
      message: inputMessage.trim(),
      timestamp: new Date(),
    };

    try {
      // Optimistically add message to UI
      setMessages(prev => [...prev, messageData]);
      setInputMessage('');

      // Send to server
      await axiosInstance.post(`/messages/send/${adminId}`, {
        message: messageData.message,
      });

      // Emit through socket
      if (chatSessionId && socketRef.current?.connected) {
        socketRef.current.emit('sendMessage', {
          sessionId: chatSessionId,
          ...messageData
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally remove the message from UI if failed
      setMessages(prev => prev.filter(msg => msg._id !== messageData._id));
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderQueueStatus = () => (
    <Card style={styles.queueCard}>
      <Text style={styles.queueText}>Bạn đang trong hàng đợi</Text>
      {queuePosition && (
        <>
          <Text style={styles.queuePosition}>Vị trí: {queuePosition.position}</Text>
          <Text style={styles.queueWaitTime}>Thời gian đợi ước tính: {queuePosition.estimatedWaitTime} phút</Text>
        </>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            iconColor="#007AFF"
          />
          <Text style={styles.headerText}>Hỗ trợ trực tuyến</Text>
        </View>
        <View style={{ flex: 1 }}>
          {!isConnected ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 16 }}>Đang kết nối...</Text>
            </View>
          ) : inQueue ? (
            renderQueueStatus()
          ) : (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1, padding: 16 }}
                onContentSizeChange={() => scrollToBottom(false)}
                onLayout={() => scrollToBottom(false)}
                keyboardShouldPersistTaps="handled"
              >
                {messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageContainer,
                      { alignItems: msg.senderId === userId ? 'flex-end' : 'flex-start' },
                    ]}
                  >
                    <Card
                      style={[
                        styles.messageCard,
                        { backgroundColor: msg.senderId === userId ? '#007AFF' : '#E5E5EA' },
                      ]}
                    >
                      <Card.Content>
                        <Text style={{ color: msg.senderId === userId ? 'white' : 'black' }}>
                          {msg.message}
                        </Text>
                      </Card.Content>
                    </Card>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Nhập tin nhắn..."
                  onFocus={() => scrollToBottom()}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={styles.sendButton}
                >
                  <Text style={{ color: 'white' }}>Gửi</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
  },
  queueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  queuePosition: {
    marginTop: 8,
    fontSize: 14,
  },
  queueWaitTime: {
    marginTop: 4,
    fontSize: 14,
    color: 'gray',
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageCard: {
    maxWidth: '80%',
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F9F9F9',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginLeft: 8,
  },
});

export default ChatScreen;
