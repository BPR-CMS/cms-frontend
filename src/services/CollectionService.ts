import axios from "axios";
import { Collection } from "@/models/Collection";

const BASE_URL = "http://localhost:8080/api/v1/collections";

let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const addCollection = async (data: Collection): Promise<Collection> => {
  try {
    const response = await axios.post(`${BASE_URL}`, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollections = async (): Promise<Collection> => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollectionById = async (id: string): Promise<Collection> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
