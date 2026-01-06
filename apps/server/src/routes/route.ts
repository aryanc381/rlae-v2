import express, { Router } from 'express';

import excelRouter from './database/excel.database.js';
import createUCRouter from './database/create.database.js';
import updateUCRouter from './database/update.database.js';
import logsRouter from './database/logs.database.js';

import SRARouter from './agents/self-reflect.agents.js';
import CMARouter from './agents/context-mapper.agent.js';
import CRouter from './agents/conversation.agent.js';
import MERouter from './agents/metric-evaluator.agent.js'
const router: Router = express.Router();

router.use('/database', excelRouter, createUCRouter, updateUCRouter, logsRouter);
router.use('/agents', SRARouter, CMARouter, CRouter, MERouter);

export default router;