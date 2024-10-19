import { RootStackParamList } from "@/layouts/types/navigationTypes";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavorite } from "@/context/FavouriteBlogContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { Blog } from "@/shared/Interface/Blog";

type BlogDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "BlogDetailScreen"
>;

type Props = {
  route: BlogDetailScreenRouteProp;
};

const BlogDetailScreen: React.FC<Props> = ({ route }) => {
  const blog = route.params?.blog as Blog;
  const [id, setId] = useState(blog?._id || "");
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [imageUri, setImageUri] = useState(blog?.picture || "");
  const [createdAt, setCreatedAt] = useState(blog?.createdAt || "");
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorite();
  
  const handleHeartPress = (id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(blog);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.createdAt}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      <View style={styles.headerContainer}>
          <Text style={styles.titleHeader}>{title}</Text>
        
        <TouchableOpacity onPress={() => handleHeartPress(id)} style={styles.heartIconContainer}>
          <Icon
            name="heart"
            size={24}
            color={isFavorite(id) ? "#ff6347" : "#ccc"}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heartIconContainer: {
    width: "10%",
    marginTop: 12,
    alignItems: "flex-end",
  },
  createdAt: {
    fontSize: 12,
    color: "#888",
  },
  titleHeader: {
    width: "90%",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "justify",
  },
  heartIcon: {
    marginLeft: 10,
  },
});

export default BlogDetailScreen;
