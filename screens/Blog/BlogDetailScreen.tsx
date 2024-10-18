import { RootStackParamList } from "@/layouts/types/navigationTypes";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Blog } from "./BlogsScreen";

type BlogDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "BlogDetailScreen"
>;

type Props = {
  route: BlogDetailScreenRouteProp;
};

const BlogDetailScreen: React.FC<Props> = ({ route }) => {
  const blog = route.params?.blog;
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [imageUri, setImageUri] = useState(blog?.picture || "");
  const [createdAt, setCreatedAt] = useState(blog?.createdAt || "");

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.createdAt}>
        {new Date(createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.titleHeader}>{title}</Text>
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

  createdAt: {
    fontSize: 12,
    color: "#888",
  },
  titleHeader: {
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
});

export default BlogDetailScreen;
