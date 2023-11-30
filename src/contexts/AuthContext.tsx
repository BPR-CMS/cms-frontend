"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserById } from "../services/UserService";
import { User } from "@/models/User";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User>();
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);
    console.log(decodedToken);
    return decodedToken ? decodedToken._id : null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error("User ID not found in token");
        }
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
