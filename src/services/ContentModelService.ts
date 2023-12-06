import axios from "axios";
import { Attribute } from "@/models/Attribute";

// const BASE_URL = "http://localhost:8080/api/v1/collections";
const BASE_URL = "https://cms-backend-production-0a2c.up.railway.app/api/v1/collections";

let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const addAttributesToCollection = async (
  collectionId: string,
  data: Attribute
): Promise<any> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${collectionId}/attributes`,
      data,
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
