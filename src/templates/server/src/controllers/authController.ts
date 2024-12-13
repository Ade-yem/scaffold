import { NextFunction, Request, Response } from "express";
import {
  login,
  createToken,
  register,
  logout,
  checkToken,
  googleLogin,
  getOrGenerateCode,
  verifyCode,
  changePassword,
} from "../service/auth";
import jwt from "jsonwebtoken";
import { sendCode } from "../service/resendService";

const domain = process.env.DOMAIN || "localhost";
const secret = process.env.jwt_SECRET as string;

export default class AuthController {
  static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await login({ email, password });
      const token = await createToken({ email, userId: user.id });
      const time = new Date();
      time.setDate(time.getDate() + 1);
      res.cookie("auth", token, {
        path: "/",
        domain,
        expires: time,
        httpOnly: true,
        signed: true,
      });
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
  static async registerUser(req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName } = req.body;
    try {
      const user = await register({ email, password, firstName, lastName });
      const token = await createToken({ email, userId: user.id });
      const time = new Date();
      time.setDate(time.getDate() + 1);
      res.cookie("auth", token, {
        path: "/",
        domain,
        expires: time,
        httpOnly: true,
        signed: true,
      });
      res.status(201).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await logout(req.signedCookies["auth"]);
      if (result) {
        res.clearCookie("auth", {
          domain,
          path: "/",
        });
        res.status(200).json({ message: "Logout successful" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.signedCookies["auth"];
    if (!token || token.trim() === "") {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    await new Promise<void>((resolve, reject) => {
      try {
        async function check() {
          await checkToken(token);
        }
        check();
      } catch (error) {
        reject(error);
        return res
          .status(401)
          .json({ message: "Token expired or unavailable" });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return jwt.verify(token, secret, (err: any, success: any) => {
        if (err) {
          reject(err);
          return res.status(401).json({ message: "Token expired" });
        } else {
          resolve();
          res.locals.userData = success;
          return next();
        }
      });
    });
  }

  static async verify(req: Request, res: Response) {
    const token = req.signedCookies["auth"];
    console.log(token);
    if (!token || token.trim() === "") {
      res.status(422).json({ message: "Invalid token" });
      return;
    }
    try {
      const ress = await checkToken(token);
      if (ress) res.status(200).json({ message: "User token exists" });
      else res.status(401).json({
        message: "Token expired or unavailable"
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Internal server error",
          cause: (error as Error).message,
        });
    }
  }

  static async loginWithGoogle(req: Request, res: Response) {
    const { email, image, firstName, lastName } = req.body;
    try {
      const user = await googleLogin({ email, image, firstName, lastName });
      if (!user) throw new Error("Could not find or create user");
      const token = await createToken({ email, userId: user.id });
      const time = new Date();
      time.setDate(time.getDate() + 1);
      res.cookie("auth", token, {
        path: "/",
        domain,
        expires: time,
        httpOnly: true,
        signed: true,
      });
      res.status(201).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async sendCode(req: Request, res: Response) {
    const { email, type } = req.body;
    try {
      const code = await getOrGenerateCode(email, type);
      if (code) {
        await sendCode(email, code);
        res.status(201).json({ message: "Code sent successfully" });
      } else res.status(401).json({message: "Could not retrieve code"});
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { email, newPassword, code, type } = req.body;
    try {
      const checkCode = await verifyCode(code, type);
      if (checkCode) {
        const user = await changePassword(email, newPassword);
        console.log(user);
        if (user) res
          .status(201)
          .json("Password change successful. Please login to continue");
        else res.status(500).json({ message: "Could not change password" });
      } else {
        res.status(401).json({ message: "Invalid code" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
