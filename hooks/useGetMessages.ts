import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export const useGetMessages = (chatUserId: string): Message[] => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/message/get/${chatUserId}`,
        );
        setMessages(response.data);
        
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chatUserId]);

  return messages;
};
