import  { User } from "../../models/mongodbModels/user";
import { Token } from "../../models/mongodbModels/token";
import * as bcrypt from "bcryptjs";

import { AuthRequestBody, GoogleData, LoginData, TokenData } from "../../types/auth";
import { Code } from "../../models/mongodbModels/code";
import { generateCode } from "../../../dist/src/utils/code";

export const registerUser = async (data: AuthRequestBody) => {
  const {firstName, lastName, password, email} = data;
  const existingUser = await User.findOne({
    email: email
  });
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
  const existingUser = await User.findOne({
    email: email
  });
  if (!existingUser) {
    throw new Error("User with email does not exist");
  } else {
    if (bcrypt.compareSync(password, existingUser.password || "")) {
      return existingUser;
    } else throw new Error("Password is not valid");
  }
}

export const addMongoToken = async (data: TokenData) => {
  const { userId, token } = data;
  const createdToken = Token.create({userId, token});
  if (!createdToken) throw new Error("Could not create token");
}

export const checkMongoToken = async (token: string): Promise<boolean> => {
  const result = await Token.findOne({token: token});
  return result ? true : false;
}

export const deleteMongoToken = async (token: string): Promise<boolean> => {
  const result = await Token.deleteOne({token: token});
  return result ? true : false;
}

export const getUserByEmailOnMongo = async (email: string) => {
  return User.findOne({email: email});
}

/**
 * Changes the password of a user in MongoDB
 * @param {string} email - The email of the user
 * @param {string} password - The new password to set
 * @returns {Promise<boolean>} - Returns true if the password was changed successfully, otherwise false
 */
export const changeMongoPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }

    user.password = password;
    await user.save();

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const mongoCreateOrFindUser = async (data: GoogleData) => {
  const {firstName, lastName, email, image} = data;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return user;
    } else {
      const newUser = await User.create({
        firstName, lastName, email, image
      });
      if (!newUser) throw new Error("Could not create user");
      return newUser;
    }

  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
}

export const mongoGetOrGenerateCode = async (email: string, type: "emailVerification" | "forgotPassword") => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const code = await Code.findOne({userId: user.id, codeType: type});
      if (code) return code.code;
      else {
        const code = generateCode();
        const saveCode = await Code.create({userId: user.id, code: code, codeType: type});
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
export const mongoVerifyCode = async (code: string, type: "emailVerification" | "forgotPassword") => {
  try {
    const gottenCode = await Code.findOne({code, codeType: type});
      if (gottenCode) return true;
      else return false;
    } catch(error) {
    throw new Error(error.message);
  }
}

export const mongoDeleteCode = async (code: string, type: "emailVerification" | "forgotPassword") => {
  try {
    const gottenCode = await Code.deleteOne({code, codeType: type});
      if (gottenCode) return true;
      else return false;
    } catch(error) {
    throw new Error(error.message);
  }
}