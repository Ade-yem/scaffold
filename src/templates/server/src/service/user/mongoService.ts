import { User } from "../../models/mongodbModels/user";

export const getUser = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}