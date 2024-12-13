import { Router} from "express";
import AuthController from "../controllers/authController";

const authRouter = Router();
authRouter.post("/login", AuthController.loginUser);
authRouter.post("/register", AuthController.registerUser);
authRouter.post("/logout", AuthController.logoutUser);
authRouter.get("/verify", AuthController.verify);
authRouter.post("/google-login", AuthController.loginWithGoogle);
authRouter.post("/send-code", AuthController.sendCode);
authRouter.post("/reset-password", AuthController.resetPassword)

export default authRouter;