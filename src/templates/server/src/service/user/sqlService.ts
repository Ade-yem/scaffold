import { User } from "../../models/sqlModels/user";

export const getSqlUser = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateSqlUser = async (email: string, firstName: string, lastName: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  user.update({ firstName, lastName });
  user.save();
  return user.dataValues;
};


