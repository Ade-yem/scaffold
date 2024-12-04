import {
  registerUser as sqlRegister,
  loginUser as sqlLogin,
  addSqlToken,
  checkSqlToken,
  deleteSqlToken,
  sqlCreateOrFindUser,
  sqlGetOrGenerateCode,
  changeSqlPassword,
  sqlVerifyCode,
} from "./sql";
import {
  registerUser as mongoRegister,
  loginUser as mongoLogin,
  addMongoToken,
  checkMongoToken,
  deleteMongoToken,
  mongoCreateOrFindUser,
  mongoGetOrGenerateCode,
  changeMongoPassword,
  mongoVerifyCode,
} from "./mongodb";
import { AuthRequestBody, GoogleData, LoginData, createTokenData } from "../../types/auth";
import serverConfig from "../../../server.config.mjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const register = async (data: AuthRequestBody) => {
  try {
    if (serverConfig.database === "mongodb") {
      const user = await mongoRegister(data);
      return {
        id: user._id,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } else {
      const user = await sqlRegister(data);
      return {
        id: user.dataValues.id,
        password: user.dataValues.password,
        email: user.dataValues.email,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const login = async (data: LoginData) => {
  try {
    if (serverConfig.database === "mongodb") {
      const user = await mongoLogin(data);
      return {
        id: user._id,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } else {
      const user = await sqlLogin(data);
      return {
        id: user.dataValues.id,
        password: user.dataValues.password,
        email: user.dataValues.email,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

const secret = process.env.jwt_SECRET as string;
const expiration = process.env.jwt_EXPIRES_IN as string;

export const createToken = async (data: createTokenData) => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiration,
  });
  const claim = token.split(".")[1];
  try {
    if (serverConfig.database === "mongodb")
      await addMongoToken({ token: claim, userId: data.userId });
    else await addSqlToken({ token: claim, userId: data.userId });
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const checkToken = async (token: string) => {
  const claim = token.split(".")[1];
  try {
    if (serverConfig.database === "mongodb") await checkMongoToken(claim);
    else await checkSqlToken(claim);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const verifyCode = async (code: string, type: "emailVerification" | "forgotPassword") => {
  try {
    if (serverConfig.database === "mongodb") return await mongoVerifyCode(code, type);
    else return await sqlVerifyCode(code, type);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const logout = async (token: string) => {
  const claim = token.split(".")[1];
  try {
    if (serverConfig.database === "mongodb") await deleteMongoToken(claim);
    else await deleteSqlToken(claim);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const googleLogin = async (data: GoogleData) => {
  try {
    if (serverConfig.database === "mongodb") {
      const user = await mongoCreateOrFindUser(data);
      if (user) return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      };
    }else {
      const user = await sqlCreateOrFindUser(data);
      if (user) return {
        id: user.dataValues.id,
        email: user.dataValues.email,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        image: user.dataValues.image
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}


export const getOrGenerateCode = async(email: string, type: "emailVerification" | "forgotPassword") => {
  try {
    if (serverConfig.database === "mongodb") return await mongoGetOrGenerateCode(email, type);
    else return await sqlGetOrGenerateCode(email, type);
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export const changePassword = async (email: string, password: string) => {
  try {
    if (serverConfig.database === "mongodb") return await changeMongoPassword(email, password);
    else return await changeSqlPassword(email, password);
  } catch (error) {
    throw new Error(error.message);
  }
}