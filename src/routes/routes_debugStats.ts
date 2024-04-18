import express from "express";
import * as debugStatsController from "../controllers/controllers_debugStats";

const router = express.Router();
router.get("/project", debugStatsController.getUniqueProject);
router.get("/", debugStatsController.getDebugStats);
router.get("/ptwshAverage", debugStatsController.ptwshComprehensiveAverage);
router.get("/iQueAverage", debugStatsController.iQueComprehensiveAverage);
router.get("/currentProjectAverage", debugStatsController.currentProjectAverage)

export default router;