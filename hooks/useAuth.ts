import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id !== null) {
          setUserId(id);
        }
      } catch (error) {
        console.error("Failed to retrieve user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  return userId;
};

export default useUserId;
