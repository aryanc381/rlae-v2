import express, { Router } from 'express';
import zod from 'zod';
import { upload } from '../middleware/upload.middleware.js';

//@ts-ignore
import excelToJson from '@boterop/convert-excel-to-json';
// did the ts-ginore because the ts file for boterop does not exist

const router: Router = express.Router();

const excelRowSchema = zod.object({
    user_id: zod.string(),
    name: zod.string(),
    category: zod.string(),
    context: zod.string(),
    email: zod.string(),
    phone: zod.coerce.string(),
    outstanding: zod.number().int(),
    due: zod.date(),
    status: zod.string(),
    followup_count: zod.int()
})
router.post('/exceltojson', upload.single("file"), async(req, res) => {
    if(!req.file) {
        return res.json({ status: 400, msg: 'File not uploaded.'})
    }

    const workbook = excelToJson({
        source: req.file.buffer,
        header: { rows: 1 },
        columnToKey: {
            A: "user_id",
            B: "name",
            C: "category",
            D: "context",
            E: "email",
            F: "phone",
            G: "outstanding",
            H: "due",
            I: "status",
            J: "followup_count"
        }
    });

    const sheetName = Object.keys(workbook)[0];
    const rows = workbook[sheetName];
    if(!rows || rows.length === 0) {
        return res.json({ status: 404, msg: 'Excel Sheet is empty.'});
    }

    const validRows: any[] = [];
    const invalidRows: any[] = [];

    rows.forEach((row: unknown, index: number) => {
        const parsed = excelRowSchema.safeParse(row);
        if(parsed.success) validRows.push(parsed.data);
        else invalidRows.push({ row_number: index + 2, issues: parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message})), raw: row});
    });

    return res.json({
        total_rows: rows.length,
        valid_rows: validRows,
        invalid_rows: invalidRows,
        all_rows: rows
    });
});

export default router;