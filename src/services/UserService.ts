import axios from "axios";
import { User } from "@/models/User";

const BASE_URL = "http://localhost:8080/api/v1/users";

export const loginUser = async (data: User): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
