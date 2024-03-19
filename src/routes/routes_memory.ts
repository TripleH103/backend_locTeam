import express from "express";
import * as memoryController from '../controllers/controllers_memory';

const router = express.Router();

router
.route('/index')
.get(memoryController.getIndexMemories)

router
.route('/regrex')
.get(memoryController.getRegexMemories)

export default router;