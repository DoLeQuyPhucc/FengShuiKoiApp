import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
      } catch (error) {
        console.error("Error getting userId:", error);
      }
    };

    getUserId();
  }, []);

  return userId;
};

export default useUserId;
