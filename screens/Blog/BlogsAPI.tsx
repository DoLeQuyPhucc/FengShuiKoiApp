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