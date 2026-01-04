import express, { Router } from 'express';
import excelRouter from './excel.route.js';

const router: Router = express.Router();

router.use('/data', excelRouter);

export default router;