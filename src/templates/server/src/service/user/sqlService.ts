import { User } from "../../models/sqlModels/user";

export const getUser = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};


