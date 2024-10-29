import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { fetchAllBlogs, deleteBlogPost } from "./BlogsAPI";
// import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useFavorite } from "@/context/FavouriteBlogContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { Blog } from "@/shared/Interface/Blog";

export default function App() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigation = useNavigation();
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorite();

  const fetchBlogPosts = async () => {
    try {
      const response = await fetchAllBlogs();
      setBlogs(response);
    } catch (error) {
      console.error("Failed to fetch blog posts", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBlogPosts();
    }, [])
  );

  const handleCreatePost = () => {
    navigation.navigate("CreatePostScreen");
  };

  const handleEditPost = (blog: Blog) => {
    navigation.navigate("CreatePostScreen", { blog });
  };

  const handleBlogDetail = (blog: Blog) => {
    navigation.navigate("BlogDetailScreen", { blog });
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      fetchBlogPosts();
      Alert.alert("Deleted", "The blog post has been deleted.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete the post.");
    }
  };

  const renderOptionsMenu = (blog: Blog) => {
    return (
      <View style={styles.menuIconContainer}>
        <TouchableOpacity>
          <Icon
            name="ellipsis-vertical-outline"
            size={24}
            onPress={() => showPostOptions(blog)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const showPostOptions = (blog: Blog) => {
    Alert.alert(
      "Post Options",
      "",
      [
        { text: "Edit", onPress: () => handleEditPost(blog) },
        {
          text: "Delete",
          onPress: () => handleDeletePost(blog._id),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleHeartPress = (blog: Blog) => {
    if (isFavorite(blog._id)) {
      removeFavorite(blog._id);
    } else {
      addFavorite(blog);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {blogs.map((blog) => (
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
              {/* {renderOptionsMenu(blog)} */}
          </TouchableOpacity>
            </View>
        ))}
      </ScrollView>

      {/* Nút "+" */}
      {/* <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity> */}
    </View>
  );
}

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
});
