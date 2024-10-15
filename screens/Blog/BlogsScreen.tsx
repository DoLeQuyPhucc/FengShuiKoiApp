import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { fetchAllBlogs } from "./BlogsAPI";

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
  // const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const loadBlogs = async () => {
      const fetchedBlogs = await fetchAllBlogs();
      setBlogs(fetchedBlogs);
    };
    loadBlogs();
  }, []);

  return (
    <ScrollView style={styles.container}>
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
    marginBottom: 20, // Add margin to ensure text doesn't overlap with createdAt
  },
  createdAt: {
    position: "absolute",
    right: 10,
    bottom: 10,
    fontSize: 12,
    color: "#888",
  },
});
