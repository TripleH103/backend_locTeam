import express from "express";
import * as manHourControllers from "../controllers/controllers_hour";

const router = express.Router();

router
.route("/")
.get(manHourControllers.getAllHours)
.post(manHourControllers.createManHours);

export default router;