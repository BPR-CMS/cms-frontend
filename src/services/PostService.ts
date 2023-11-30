import { Post } from "@/models/Post";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";
let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const addPost = async (
  collectionId: string,
  postData: Post
): Promise<Post> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/posts/${collectionId}`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostsByCollectionId = async (
  collectionId: string
): Promise<Post[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/posts/${collectionId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
