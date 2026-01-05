import express, { Router } from 'express';
import zod from 'zod';
import { embed } from '../../functions/embed.js';
import { vecDB_client } from '../../functions/vec-store.js';
import dotenv from 'dotenv';
import { prisma } from '../../lib/prisma.js';

dotenv.config();

const router: Router = express.Router();

const inputObj = zod.object({
    context: zod.string() 
});

router.post('/context-mapper', async(req, res) => {
    const parsed = inputObj.safeParse(req.body);
        if(!parsed.success) {
            const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
            return res.json({
                status: 403,
                msg: 'Invalid /create body.',
                error: formattedErrors
            });
    }
    const { context } = parsed.data;
    const vector = await embed(context);
    const search = await vecDB_client.search(`${process.env.VEC_DB_NAME}`, {
        vector, limit: 1, with_payload: true
    });

    if(search.length === 0) {
        return res.json({
            status: 201, 
            msg: 'New use-case, using base-prompt.'
        });
    }

    const top_match = search[0];
    const theta = top_match?.score ?? 0;
    if(theta < 0.70) {
        return res.json({
            status: 201,
            theta: theta,
            msg: 'Use-case does not qualify similarity check threshold with DB-Usecases, using base-prompt.'
        });
    }

    const use_case = await prisma.kB_MAIN.findFirst({
        where: { id: Number(top_match?.id) }
    });
    if(!use_case) {
        return res.json({
            status: 403,
            vec_db_id: top_match?.id,
            msg: 'Vector-DB and Postgres-DB Mismatch, using base prompt.'
        });
    }

    return res.json({
        status: 200,
        theta: theta,
        msg: `Fetched Agent based on RLAE USE-CASE[${use_case.use_case}]`,
        matched_use_case_id: use_case.id,
        matched_vec_db_id: top_match?.id,
        matched_use_case: use_case.use_case,
        qualities: use_case.qualities,
        specifications: use_case.specs,
        outliers: use_case.outliers
    });
});

export default router;