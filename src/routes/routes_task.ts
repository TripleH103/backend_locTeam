import express from 'express';
import * as taskController from "../controllers/controllers_task";
import * as authController from "../controllers/controllers_auth";

const router = express.Router();

router
.route("/")
.get(authController.protect, authController.restrictTo("admin"), taskController.getAllTasks)
.post(taskController.createTask);

router
.route("/:taskId")
.patch(authController.protect, authController.restrictTo("admin"), taskController.updateSelectedTask)
.delete(authController.protect, authController.restrictTo("admin"), taskController.deleteSelectedTask);

router
.route("/newChild/:resourcesId")
.post(taskController.createNewChildTask);

export default router;