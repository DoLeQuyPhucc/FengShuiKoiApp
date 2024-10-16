import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import { createBlogPost } from "./BlogsAPI";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("64b0c8c7f0d55a001f0d7d1e");
  const [imageUri, setImageUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [result, setResult] = useState<ImagePicker.ImagePickerResult | null>(null);

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
    await requestPermission(); // Kiểm tra quyền truy cập vào thư viện ảnh

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResult(result);
      // uploadImage(result);
    }
  };

  const takePhoto = async () => {
    await requestCameraPermission(); // Kiểm tra quyền truy cập vào camera

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);

      setResult(result);
    //   uploadImage(result);
    }
  };
  const uploadImageToFirebase = async (uri: string) => {
    if (!uri) return null;

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);
    
    setUploading(true);

    const task = storageRef.putFile(uri);

    // Monitor the upload progress
    task.on('state_changed', snapshot => {
      console.log(`Transferred: ${snapshot.bytesTransferred} bytes`);
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setDownloadURL(url);
      setUploading(false);
      return url;
    } catch (e) {
      console.error(e);
      setUploading(false);
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content || !authorId) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    try {
      // Upload image to Firebase
    //   const firebaseImageUrl = pictureUri ? await uploadImageToFirebase(pictureUri) : null;

      // Tạo bài post sau khi upload ảnh thành công
      const newPost = {
        title,
        content,
        picture: imageUri,
        authorId,
      };
      console.log(newPost);

      await createBlogPost(newPost);
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
