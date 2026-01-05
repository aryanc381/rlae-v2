import express, { Router } from 'express';

import excelRouter from './dc/excel.dc.js';

import vectorRouter from './database/prompt.vector.js';

import createUCRouter from './database/create.database.js';

const router: Router = express.Router();

router.use('/data', excelRouter);
router.use('/darwin', createUCRouter);

export default router;