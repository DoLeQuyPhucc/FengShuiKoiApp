import axiosInstance from "@/api/axiosInstance";
import { Alert } from "react-native";

interface PaymentError {
  message: string;
  code?: string;
  technicalDetails?: any;
}

export const PaymentService = {
  createPaymentIntent: async (amount: number) => {
    try {
      console.log("Creating payment intent for amount:", amount);

      const response = await axiosInstance.post(
        "/payment/create-payment-intent",
        {
          amount: Math.floor(amount * 1),
          currency: "usd",
        }
      );

      console.log("Payment intent created successfully:", response.data);
      return response.data.clientSecret;
    } catch (error: any) {
      console.log("Complete error object:", error);
      console.log("Error response data:", error.response?.data);
      console.log("Error response status:", error.response?.status);
      console.log("Error response headers:", error.response?.headers);

      const paymentError: PaymentError = {
        message:
          error.response?.data?.message || "Payment intent creation failed",
        code: error.response?.data?.code,
        technicalDetails: {
          status: error.response?.status,
          data: error.response?.data,
          requestData: {
            amount,
            currency: "usd",
          },
        },
      };

      throw paymentError;
    }
  },

  processPayment: async (clientSecret: string) => {
    try {
      // Payment successful
      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Payment Failed", "Please try again.");
      return false;
    }
  },
};