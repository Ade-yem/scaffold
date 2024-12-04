import  {User} from "../../models/sqlModels/user";
import * as bcrypt from "bcryptjs";
import { Token } from "../../models/sqlModels/token";
import { AuthRequestBody, GoogleData, LoginData, TokenData } from "../../types/auth";
import { generateCode } from "../../../dist/src/utils/code";
import { Code } from "../../models/mongodbModels/code";

export const registerUser = async (data: AuthRequestBody) => {
  const {firstName, lastName, password, email} = data;
  const existingUser = await User?.findOne({where: {email}})
  if (existingUser) {
    throw new Error("User already exists");
  } else {
    const user = await User.create({
      firstName, lastName, email, password
    })
    if (!user) throw new Error("Could not create user");
    return user;
  }
}
export const loginUser = async (data: LoginData) => {
  const {password, email} = data;
  const user = await User?.findOne({where: {email}})
  if (!user) {
    throw new Error("User with email does not exist");
  } else {
    const pass = bcrypt.compareSync(password, user.dataValues.password);
    if (!pass) throw new Error("Password does not match");
    return user;
  }
}

export const addSqlToken = async (data: TokenData) => {
  const { userId, token } = data;
  const createdToken = await Token.create({userId, token});
  if (!createdToken) throw new Error("Could not create token");
}

export const checkSqlToken = async (token: string): Promise<boolean> => {
  const result = await Token.findOne({where: {token}});
  if (result) {
    const date = new Date();
    if (date < result.dataValues.expiresAt) return true;
    else await Token.destroy({where: {token}});
  }
  return false;
}

export const deleteSqlToken = async (token: string): Promise<boolean> => {
  const result = await Token.findOne({where: {token}});
  if (result) {
    await Token.destroy({where: {token}});
    return true;
  }
  return false;
}

export const sqlCreateOrFindUser = async (data: GoogleData) => {
  const {firstName, lastName, email, image} = data;
  try {
    // Find the user by email
    const user = await User.findOne({where: { email: email }});
    if (user) {
      return user;
    } else {
      const newUser = await User.create({
        firstName, lastName, email, image
      });
      if (!newUser) throw new Error("Could not create user");
      else return newUser;
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export const sqlGetOrGenerateCode = async (email: string, type: "emailVerification" | "forgotPassword") => {
  try {
    const user = await User.findOne({where: { email: email }});
    if (user) {
      const code = await Code.findOne({where: {userId: user.dataValues.id, codeType: type}});
      if (code) return code.code;
      else {
        const code = generateCode();
        const saveCode = await Code.create({userId: user.dataValues.id, code: code, codeType: type});
        if (!code) throw new Error("Could not create code");
        return saveCode.code
      }
    }
    else throw new Error("Could not find user with the mail");
  } catch(error) {
    console.error("Error changing password:", error);
    return false;
  }
}
export const sqlVerifyCode = async (code: string, type: "emailVerification" | "forgotPassword") => {
  try {
    const gotCode = await Code.findOne({where: {code: code, codeType: type}});
    if (gotCode) return true;
    else return false
  } catch(error) {
    console.error("Error changing password:", error);
    return false;
  }
}
export const sqlDeleteCode = async (code: string, type: "emailVerification" | "forgotPassword") => {
  try {
    await Code.findOneAndDelete({where: {code: code, codeType: type}});
  } catch(error) {
    throw new Error(error.message);
    return false;
  }
}

export const changeSqlPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    // Find the user by email
    const user = await User.findOne({where: { email: email }});
    if (!user) {
      throw new Error("User not found");
    }

    user.set(password, password);
    await user.save();

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}