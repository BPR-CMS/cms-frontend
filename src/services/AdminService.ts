import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "http://localhost:8080/api/v1/admin";

export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAdmin = async (data: User): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/initialize`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
