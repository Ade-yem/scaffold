import { axiosInstance } from "./axios";

export const changeName = async (firstName: string, lastName: string) => {
  const res = await axiosInstance.post("/user/change-name", {
    firstName,
    lastName,
  });
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message);
  }
  return response.message;
};
export const changePassword = async (password: string, newPassword: string) => {
  const res = await axiosInstance.post("/user/change-password", {
    password,
    newPassword,
  });
  const response = await res.data;
  if (res.status !== 200) {
    throw new Error(response.message);
  }
  return response.message;
};
