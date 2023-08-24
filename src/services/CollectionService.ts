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

export const addCollection = async (data: Collection): Promise<any> => {
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
