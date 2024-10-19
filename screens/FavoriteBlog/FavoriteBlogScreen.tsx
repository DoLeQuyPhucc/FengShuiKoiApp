import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "@/layouts/types/navigationTypes";
import { useFavorite } from "@/context/FavouriteBlogContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { Blog } from "../Blog/BlogsScreen";
import Colors from "@/constants/Colors";

type FavoriteBlogScreenRouteProp = RouteProp<RootStackParamList, "ListFavoriteBlogScreen">;

type Props = {
  route: FavoriteBlogScreenRouteProp;
};  

const FavoriteBlogScreen: React.FC<Props> = () => {
//   const blog = route.params?.blog; // Access the blog being edited if provided
    const { clearFavorites, isFavorite, favoriteItems, removeFavorite} = useFavorite();
    const navigation = useNavigation();

    
  const handleBlogDetail = (blog: Blog) => {
    navigation.navigate("BlogDetailScreen", { blog });
  };
  const handleHeartPress = (blog: Blog) => {
    if (isFavorite(blog._id)) {
      removeFavorite(blog._id);
    }
  };
  
  const handleClearFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorite items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => clearFavorites(),
        },
      ]
    );
  };

  return (
<View style={styles.container}>
      <ScrollView>
        {favoriteItems.map((blog) => (
          <View key={blog._id} style={styles.blogContainer}>
              <TouchableOpacity onPress={() => handleBlogDetail(blog)}>
              <Image source={{ uri: blog.picture }} style={styles.image} />
              <View style={styles.headerContainer}>
          <Text style={styles.titleHeader}>{blog.title}</Text>
              
        <TouchableOpacity onPress={() => handleHeartPress(blog)} style={styles.heartIconContainer}>
          <Icon
            name="heart"
            size={24}
            color={isFavorite(blog._id) ? "#ff6347" : "#ccc"}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
            </View>
            <Text 
                style={styles.content}
                numberOfLines={2}  
                ellipsizeMode="tail"  
              >{blog.content}</Text>
              <Text style={styles.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </Text>
          </TouchableOpacity>
            </View>
        ))}
      </ScrollView>
      {favoriteItems.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFavorites}>
                <Icon name="trash-bin-outline" size={20} color="white" />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingVertical: 30,
      backgroundColor: "#f5f5f5",
    },
    blogContainer: {
      marginBottom: 24,
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      paddingBottom: 4,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      position: "relative",
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    content: {
      fontSize: 14,
      color: "#333",
      marginBottom: 40,
    },
    createdAt: {
      position: "absolute",
      right: 10,
      bottom: 10,
      fontSize: 12,
      color: "#888",
    },
    menuIconContainer: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 20,
      backgroundColor: "#007bff",
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    heartIconContainer: {
      width: "10%",
      alignItems: "flex-end",
    },
    titleHeader: {
      width: "90%",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "left",
    },
    heartIcon: {
      marginLeft: 10,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.lightGreen,
      padding: 12,
      borderRadius: 25,
      margin: 10,
    },
    clearButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });

export default FavoriteBlogScreen;
