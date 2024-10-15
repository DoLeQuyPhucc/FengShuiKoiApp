import axiosInstance from "@/api/axiosInstance";

export const useSendMessage = (receiverId: string) => {
  const sendMessage = async (message: string) => {
    try {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  return sendMessage;
};
