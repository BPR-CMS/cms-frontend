import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "http://localhost:8080/api/v1/users";
let TOKEN = "";

if (typeof window !== "undefined") {
  TOKEN = window.localStorage.getItem("token") || "";
  if (!TOKEN) {
    console.log("Token is missing from local storage");
  }
}

export const loginUser = async (data: User): Promise<User> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
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

export const setPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  try {
    await axios.patch(
      `${BASE_URL}/setPassword/${userId}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
