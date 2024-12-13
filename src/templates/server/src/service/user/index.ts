import serverConfig from "../../../server.config";
import { getMongoUser, updateMongoUser } from "./mongoService";
import { getSqlUser, updateSqlUser } from "./sqlService";

export const getUser = async (email: string) => {
  try {
    if (serverConfig.database === "mongodb") {
      const user = await getMongoUser(email);
      return {
        id: user._id,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } else {
      const user = await getSqlUser(email);
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
      throw new Error((error as Error).message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const changeName = async (firstName:string, lastName: string, email: string) => {
  try {
    if (serverConfig.database === "mongodb") {
      const user = await updateMongoUser(email, firstName, lastName);
      return {
        id: user._id,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } else {
      const user = await updateSqlUser(email, firstName, lastName);
      return {
        id: user.id,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error((error as Error).message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}