import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { changeName, getUser } from "../service/user";
import { changePassword } from "../service/auth";

  export default class UserController {
    static async getUserData(req: Request, res: Response) {
      try {
        const { email } = res.locals.userData;
        const user = await getUser(email);
        res.status(201).json({ message: "Fetch successful", user });        
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }
      
    }
    static async updateName(req: Request, res: Response) {
      const { firstName, lastName } = req.body;
      const { email } = res.locals.userData;
      try {
        const user = await changeName(firstName, lastName, email);
        res.status(201).json({ message: "Name changed successfully", user });
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }

      
    }
    static async updatePassword(req: Request, res: Response) {
      const { password, newPassword } = req.body;
      const { email } = res.locals.userData;
      try {
        const existing = await getUser(email);
        if (!existing) {
          res.status(422).json({message: "You do not have an account with us"});
          return;
        }
        if (!bcrypt.compareSync(password, existing.password)) {
          res
            .status(422)
            .json({ message: "Incorrect password" });
          return;
        }
        const user = await changePassword(email, newPassword);
        res.status(201).json({message: "Password change successful", user});
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  }
  