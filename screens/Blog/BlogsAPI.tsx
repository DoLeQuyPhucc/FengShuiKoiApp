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
  const response = await fetch("https://fengshuikoiapi.onrender.com/api/blog/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error("Error creating blog post");
  }

  return await response.json();
};
