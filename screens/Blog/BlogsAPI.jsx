import axiosInstance from "@/api/axiosInstance";

export const fetchAllBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blog/' );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const createBlogPost = async (newPost) => {
  try {
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('authorId', newPost.authorId);
    formData.append('picture', {
      uri: newPost.picture,
      name: newPost.picture.split('/').pop(),
      type: 'image/jpeg',
    });

    const response = await axiosInstance.post('/blog/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const updateBlogPost = async (id, updatedFields) => {
  try {
    const formData = new FormData();  
    if (updatedFields.title) {
      formData.append('title', updatedFields.title);
    }
    if (updatedFields.content) {
      formData.append('content', updatedFields.content);
    }
    if (updatedFields.authorId) {
      formData.append('authorId', updatedFields.authorId);
    }
    if (updatedFields.picture) {
      formData.append('picture', {
        uri: updatedFields.picture,
        name: updatedFields.picture.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await axiosInstance.patch(`/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};


export const deleteBlogPost = async (id) => {
  try {
    await axiosInstance.delete(`/blog/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};