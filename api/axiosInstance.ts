import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  // baseURL: "https://fengshuikoiapi.onrender.com/api",
  // baseURL: "http://localhost:5000/api/",
  baseURL: "http://10.0.2.2:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const clearAuthTokens = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken", "userId"]);
};

// Add a request interceptor to include the access token in the headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and refresh token logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is related to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get the refresh token from storage
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          // If no refresh token, clear everything and reject
          await clearAuthTokens();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}auth/refresh-token`,
          { token: refreshToken }
        );

        if (response.status === 200) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          // Store the new tokens in AsyncStorage
          await AsyncStorage.setItem("accessToken", newAccessToken);
          await AsyncStorage.setItem("refreshToken", newRefreshToken);

          // Update the authorization header with the new access token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle token refresh failure (e.g., redirect to login page)

        await clearAuthTokens();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
