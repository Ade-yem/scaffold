import { Router } from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";

  const userRouter = Router();
  userRouter.get("/get-user", AuthController.verifyToken, UserController.getUser);
  export default userRouter;
  