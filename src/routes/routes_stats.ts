import express from "express";
import * as statsController from "../controllers/controllers_stats";


const router = express.Router();

router
.route("/")
.get(statsController.getProjectWorkingTime);

router.get("/project", statsController.getUniqueProject);
router.get("/projectStats", statsController.getProjectStats);
router.get("/pokemon", statsController.getPersonalProjectStats)

export default router;