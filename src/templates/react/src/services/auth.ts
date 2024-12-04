import { axiosInstance } from "./axios";
import { User } from "@/components/context/authContext";
import { googleLogout } from "@react-oauth/google";

type LoginData = {
  email: string;
  password: string;
}
type registerData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async (data: registerData): Promise<User> => {
  const res = await axiosInstance.post("/auth/register", data);
  const response = await res.data;
  if (res.status !== 201) {
    throw new Error(response.message)
  }
  return {
    email: response.email, firstName: response.firstName, lastName: response.lastName, id: response.id
  }
}

export const login = async (data: LoginData): Promise<User> => {
  const res = await axiosInstance.post("/auth/login", data);
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message)
  }
  return {
    email: response.email, firstName: response.firstName, lastName: response.lastName, id: response.id
  }
}

export const logout = async (): Promise<void> => {
  const res = await axiosInstance.post("/auth/logout");
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message)
  }
  try {
    googleLogout()
  } catch (error) {
    console.log(error);
  }
}

export const googleLogin = async(data: User) => {
  const res = await axiosInstance.post("/auth/login", data);
  const response = await res.data;
  if (res.status !== 201) {
    throw new Error(response.message)
  }
  return {
    email: response.email, firstName: response.firstName, lastName: response.lastName, id: response.id
  }
}

export const sendForgotPasswordCode = async (email: string) => {
  const res = await axiosInstance.post("/auth/forgot-password", {email});
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message)
  }
  return response.message;
}

export const resetPassword = async (email: string, password: string) => {
  const res = await axiosInstance.post("/auth/reset-password", {email, password});
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message)
  }
  return response.message;
}