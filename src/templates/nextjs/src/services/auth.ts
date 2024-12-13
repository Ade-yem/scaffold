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
  const response = await res.data.user;
  return {
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    id: response.id,
  };
};

export const login = async (data: LoginData): Promise<User> => {
  const res = await axiosInstance.post("/auth/login", data);
  const response = await res.data.user;
  return {
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    id: response.id,
  };
};

export const logout = async (): Promise<string> => {
  const res = await axiosInstance.post("/auth/logout");
  googleLogout();
  return res.data.message;
};

export const googleLogin = async (data: User): Promise<User> => {
  const res = await axiosInstance.post("/auth/login", data);
  const response = await res.data.user;
  return {
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    id: response.id,
  };
};

export const sendForgotPasswordCode = async (email: string) => {
  const res = await axiosInstance.post("/auth/send-code", {
    email,
    type: "forgotPassword",
  });
  const response = await res.data;
  return response.message;
};

export const resetPassword = async (
  email: string,
  password: string,
  code: string,
) => {
  const res = await axiosInstance.post("/auth/reset-password", {
    email,
    password,
    code,
    type: "forgotPassword",
  });
  const response = await res.data;
  return response.message;
};
