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
} from 'react-native';
import { Text, Card } from 'react-native-paper';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [queuePosition, setQueuePosition] = useState<QueuePosition | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string>("6707fe5445f0dc6fdde0b347"); // Admin ID từ server
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

      socketRef.current = io('http://localhost:5000', {
        query: { userId: storedUserId },
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        socketRef.current.emit('joinQueue', { userId: storedUserId });
      });

      socketRef.current.on('queuePosition', (data: QueuePosition) => {
        setInQueue(true);
        setQueuePosition(data);
      });

      socketRef.current.on('chatStart', (data: { sessionId: string }) => {
        setInQueue(false);
        setChatSessionId(data.sessionId);
        loadPreviousMessages();
      });

      socketRef.current.on('queueTimeout', () => {
        setInQueue(false);
        // Hiển thị thông báo yêu cầu quay lại sau
        Alert.alert(
          'Thông báo',
          'Hiện tại không có admin trực. Vui lòng quay lại sau.',
          [{ text: 'OK' }]
        );
      });

      socketRef.current.on('newMessage', (message: Message) => {
        // Chỉ thêm tin nhắn mới nếu đã load xong tin nhắn cũ
        if (!isLoadingMessages) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    };

    initializeChat();
  }, []);

  const loadPreviousMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await axiosInstance.get(`/messages/get/${adminId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !adminId) return;

    try {
      const tempMessage = {
        _id: Date.now().toString(),
        senderId: userId as string,
        message: inputMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tempMessage]);

      await axiosInstance.post(`/messages/send/${adminId}`, {
        message: inputMessage,
      });

      if (chatSessionId) {
        socketRef.current.emit('sendMessage', {
          sessionId: chatSessionId,
          senderId: userId,
          message: inputMessage,
          timestamp: new Date(),
        });
      }

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderQueueStatus = () => (
    <Card style={{ margin: 16, padding: 16 }}>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>
        Bạn đang trong hàng đợi
      </Text>
      {queuePosition && (
        <>
          <Text style={{ textAlign: 'center', marginTop: 8 }}>
            Vị trí: {queuePosition.position}
          </Text>
          <Text style={{ textAlign: 'center', marginTop: 4 }}>
            Thời gian đợi ước tính: {queuePosition.estimatedWaitTime} phút
          </Text>
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
        <View style={{ flex: 1 }}>
          {!isConnected ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                    style={{
                      alignItems: msg.senderId === userId ? 'flex-end' : 'flex-start',
                      marginBottom: 8,
                    }}
                  >
                    <Card
                      style={{
                        maxWidth: '80%',
                        backgroundColor: msg.senderId === userId ? '#007AFF' : '#E5E5EA',
                      }}
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
              <View
                style={{
                  flexDirection: 'row',
                  padding: 16,
                  borderTopWidth: 1,
                  borderTopColor: '#E5E5EA',
                  backgroundColor: 'white',
                }}
              >
                <TextInput
                  ref={inputRef}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#E5E5EA',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    backgroundColor: 'white',
                  }}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Nhập tin nhắn..."
                  onFocus={() => scrollToBottom()}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={{
                    backgroundColor: '#007AFF',
                    borderRadius: 20,
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 60,
                  }}
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

export default ChatScreen;