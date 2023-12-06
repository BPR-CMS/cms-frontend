import axios from "axios";
import { User } from "@/models/User";

// const BASE_URL = "http://localhost:8080/api/v1/users";
const BASE_URL = "https://cms-backend-production-0a2c.up.railway.app/api/v1/users";

let TOKEN = "";

const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token") || "";
  }
  return "";
};

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
        Authorization: `Bearer ${getToken()}`,
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
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
