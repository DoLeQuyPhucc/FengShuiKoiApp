import { Product } from "@/screens/ProductsList";
import { Blog } from "@/shared/Interface/Blog";
import { Order } from "@/shared/Interface/Order";

export type RootStackParamList = {
  Main: {
    screen: keyof BottomTabParamList;
  };
  HomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  WelcomeScreen: undefined;
  ResultScreen: { date: string };
  AuthLoadingScreen: undefined;
  SearchResults: { query: string };
  PackageDetail: { id: string };
  CartScreen: undefined;
  ProfileScreen: undefined;
  OrderScreen: undefined;
  OrderDetail: { orderId: string };
  OrderForm: undefined;
  OrderResult: { orderData: string } | { vnpayData: string };
  AddressScreen: undefined;
  AddAddressScreen: undefined;
  FilterResults: { brandName: string };
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  CreatePostScreen: undefined | { blog: Blog };
  BlogDetailScreen: { blog: Blog };
  ListFavoriteBlogScreen: undefined;
  CheckoutScreen: undefined;
  OrderConfirmationScreen: { order: Order };
  CreateProduct: { product: Product } | undefined;
  ProductDetail: { productId: string };
  MyProduct: undefined;
  ChatScreen: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
  Notifications: undefined;
  Blogs: undefined;
  Products: undefined;
  Cart: undefined;
};
