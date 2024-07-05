import express from "express";
import * as debugStatsController from "../controllers/controllers_debugStats";

const router = express.Router();
router.get("/project", debugStatsController.getUniqueProject);
router.get("/genres", debugStatsController.getUniqueGenres);
router.get("/", debugStatsController.getDebugStats);
router.get("/ptwshAverage", debugStatsController.ptwshComprehensiveAverage);
router.get("/iQueAverage", debugStatsController.iQueComprehensiveAverage);
router.get("/dhsAverage", debugStatsController.dhsComprehensiveAverage);
router.get("/currentProjectAverage", debugStatsController.currentProjectAverage);
router.get("/genresAverage", debugStatsController.genresAverage)

export default router;