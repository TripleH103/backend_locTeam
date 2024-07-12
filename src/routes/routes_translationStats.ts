import express from "express";
import * as translationStatsController from "../controllers/controllers_tranlsationStats";

const router = express.Router();
router.get("/project", translationStatsController.getUniqueProject);
router.get("/", translationStatsController.getTranslationStats);
router.get("/ptwshAverage", translationStatsController.ptwshComprehensiveAverage);
router.get("/iQueAverage", translationStatsController.iQueComprehensiveAverage);
router.get("/dhsAverage", translationStatsController.dhsComprehensiveAverage);
router.get("/currentProjectAverage", translationStatsController.currentProjectAverage);
router.get("/genresAverage", translationStatsController.genresAverage)

export default router;