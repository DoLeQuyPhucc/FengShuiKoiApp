import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { createBlogPost, 
  updateBlogPost 
} from "./BlogsAPI"; // import updateBlogPost
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "@/layouts/types/navigationTypes";

type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePostScreen">;

type Props = {
  route: CreatePostScreenRouteProp;
};

const CreatePostScreen: React.FC<Props> = ({ route }) => {
  const blog = route.params?.blog; // Access the blog being edited if provided


  const [initialTitle, setInitialTitle] = useState(blog?.title || "");
  const [initialContent, setInitialContent] = useState(blog?.content || "");
  const [initialImageUri, setInitialImageUri] = useState(blog?.picture || "");

  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [imageUri, setImageUri] = useState(blog?.picture || "");
  const [uploading, setUploading] = useState(false);
  const [authorId, setAuthorId] = useState("64b0c8c7f0d55a001f0d7d1e"); // Assuming a fixed authorId for simplicity

  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getUpdatedFields = () => {
    const updatedFields: any = {};

    if (title !== initialTitle) {
      updatedFields.title = title;
    }
    if (content !== initialContent) {
      updatedFields.content = content;
    }
    if (imageUri !== initialImageUri) {
      updatedFields.picture = imageUri;
    }

    return updatedFields;
  };

  const handleSavePost = async () => {
    if (!title || !content || !authorId) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setUploading(true);

    try {
      const updatedFields = getUpdatedFields();
      const postData = { ...updatedFields, authorId };
      if (blog) {
        console.log("put")
        await updateBlogPost(blog._id, postData);
        Alert.alert("Success", "Post updated successfully!");
      } else {
        await createBlogPost(postData);
        Alert.alert("Success", "Post created successfully!");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save the post. Please try again.");
    } finally {
      setUploading(false); // End loading
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter post title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={content}
        onChangeText={setContent}
        placeholder="Enter post content"
        multiline
      />

      <Button title="Select Image from Library" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={uploading ? "Uploading..." : blog ? "Update Post" : "Create Post"}
          onPress={handleSavePost}
          disabled={uploading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  contentInput: {
    height: 150,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default CreatePostScreen;
