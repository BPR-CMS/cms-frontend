import axios from "axios";
import { Admin } from "@/models/Admin";

const BASE_URL = "http://localhost:8080/api/v1";

export const checkAdminExists = async (): Promise<{ adminExists: boolean }> => {
  try {
    const response = await axios.get(`${BASE_URL}/initialize`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAdmin = async (data: Admin): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/initialize`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
