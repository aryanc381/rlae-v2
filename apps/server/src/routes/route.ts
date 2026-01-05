import express, { Router } from 'express';

import excelRouter from './database/excel.database.js';
import createUCRouter from './database/create.database.js';
import updateUCRouter from './database/update.database.js';

import SRARouter from './agents/self-reflect.agents.js';

const router: Router = express.Router();

router.use('/database', excelRouter, createUCRouter, updateUCRouter);
router.use('/darwin', createUCRouter);
router.use('/agents', updateUCRouter);

export default router;