import express from "express";
import * as estimateController from "../controllers/controllers_estimate";


const router = express.Router();

router.get("/", estimateController.getEstimates);

export default router;