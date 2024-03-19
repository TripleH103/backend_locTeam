import express from "express";
import * as GlossaryController from "../controllers/controllers_g";


const router = express.Router();

router
.route('/')
.get(GlossaryController.getGlossaries)
.post(GlossaryController.createGlossary);

router
.route('/:glossary_id') 
.get(GlossaryController.getGlossary);

export default router;