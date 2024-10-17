import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { fetchAllBlogs } from "./BlogsAPI";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

interface Blog {
  _id: string;
  title: string;
  content: string;
  picture: string;
  createdAt: string;
}

export default function App() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigation = useNavigation();

  const fetchBlogPosts = async () => {
    try {
      const response = await fetchAllBlogs();
      setBlogs(response);
    } catch (error) {
      console.error("Failed to fetch blog posts", error);
    }
  };

  // Khi màn hình được focus, gọi lại hàm fetchBlogPosts
  useFocusEffect(
    React.useCallback(() => {
      fetchBlogPosts();
    }, [])
  );

  const handleCreatePost = () => {
    navigation.navigate("CreatePostScreen");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {blogs.map((blog) => (
          <View key={blog._id} style={styles.blogContainer}>
            <Image source={{ uri: blog.picture }} style={styles.image} />
            <Text style={styles.title}>{blog.title}</Text>
            <Text style={styles.content}>{blog.content}</Text>
            <Text style={styles.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Nút "+" */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  blogContainer: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  createdAt: {
    position: "absolute",
    right: 10,
    bottom: 10,
    fontSize: 12,
    color: "#888",
  },
  // Floating Action Button (FAB) style
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
});
