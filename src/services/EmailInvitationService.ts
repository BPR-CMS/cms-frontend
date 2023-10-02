import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "http://localhost:8080/api/v1/invitations";
let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const inviteUser = async (data: User): Promise<User> => {
  try {
    const response = await axios.post(`${BASE_URL}/send`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
