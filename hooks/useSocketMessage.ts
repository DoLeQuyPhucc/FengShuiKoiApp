import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

export const useSocketMessage = (onMessageReceived: (message: any) => void) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Set up the listener for new messages
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      onMessageReceived(message);
    });

    // Clean up the listener on component unmount
    return () => {
      socket.off("newMessage");
    };
  }, [socket, onMessageReceived]);
};
