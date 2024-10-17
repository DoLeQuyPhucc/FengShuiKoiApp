import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import { createBlogPost } from "./BlogsAPI";
import {RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "@/layouts/types/navigationTypes";

type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePostScreen">;

type Props = {
  route: CreatePostScreenRouteProp;
};

const CreatePostScreen: React.FC<Props> = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("64b0c8c7f0d55a001f0d7d1e");
  const [imageUri, setImageUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const navigation = useNavigation();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need permission to access your media library.');
    }
  };
  
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need permission to access your camera.');
    }
  };
  const pickImage = async () => {
    await requestPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    await requestCameraPermission();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content || !authorId) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    try {
      const newPost = {
        title,
        content,
        picture: imageUri,
        authorId,
      };
      await createBlogPost(newPost);
      navigation.goBack()
      Alert.alert("Success", "Post created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create the post. Please try again.");
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

      <View style={styles.imagePicker}>
        <Button title="Select Image from Library" onPress={pickImage} />
        <Button title="Take Photo with Camera" onPress={takePhoto} />
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={uploading ? "Uploading..." : "Create Post"}
          onPress={handleCreatePost}
          disabled={uploading}
        />
      </View>
    </ScrollView>
  );
}

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
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CreatePostScreen;