import express from "express";
import * as authController from "../controllers/controllers_auth";
import * as userController from "../controllers/controllers_user";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin",authController.signin);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/me", authController.protect, userController.getMe, userController.getOneUser);
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);

router
.route("/")
.get(authController.protect, authController.restrictTo("admin"), userController.getAllUsers)
.post(authController.protect, authController.restrictTo("admin"), userController.createUser);

router
.route("/:userId")
.get(authController.protect, userController.getOneUser)
.delete(authController.protect, userController.deleteUser);

export default router;