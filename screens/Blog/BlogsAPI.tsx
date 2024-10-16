import axios from "axios"

export const fetchAllBlogs = async () => {
  try {
    const response = await axios.get('https://fengshuikoiapi.onrender.com/api/blog/' );
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const createBlogPost = async (newPost: any) => {
  const formData = new FormData();

  // Thêm các trường dữ liệu vào FormData
  formData.append('title', newPost.title);
  formData.append('content', newPost.content);
  formData.append('authorId', newPost.authorId);

  const uri = await fetch(newPost.image.uri);
  const blob = await uri.blob();
  
  formData.append('picture', blob, newPost.image.uri.split('/').pop());

  console.log("formData");  
  console.log(formData);  
  const response = await fetch("https://fengshuikoiapi.onrender.com/api/blog/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  });
  
  console.log("response");
  
  console.log(response);

  if (!response.ok) {
    throw new Error("Error creating blog post");
  }

  return await response.json();
};
