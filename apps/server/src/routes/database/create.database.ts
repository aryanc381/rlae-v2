import express, { Router } from 'express';
import zod from 'zod';
import { prisma } from '../../lib/prisma.js';
import { embed } from '../../functions/embed.js';
import { vecDB_client } from '../../functions/vec-store.js';
import dotenv from 'dotenv';

dotenv.config()

const router: Router = express.Router();

const inputObj = zod.object({
    category: zod.string(),
    use_case: zod.string(),
    qualities: zod.array(zod.string()),
    outliers: zod.array(zod.string()),
    specs: zod.array(zod.string()),
    conv_rate: zod.number(),
});

router.post('/create-new-kb', async(req, res) => {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }

    const { category, use_case, qualities, outliers, specs, conv_rate } = parsed.data;
    const existing_user = await prisma.kB_MAIN.findUnique({
        where: { use_case: use_case }
    });
    
    if(existing_user) {
        return res.json({
            status: 405,
            msg: 'User already exists.',
            user_info: { id: existing_user.id, use_case: existing_user.use_case }
        });
    }
    
    const embeddings = await embed(use_case);

    const new_use_case = await prisma.kB_MAIN.create({
        data: {
            category: category,
            use_case: use_case,
            qualities: qualities,
            outliers: outliers,
            specs: specs,
            conv_rate: conv_rate,
            RFC: "New Unique USE-CASE Added."
        }
    });

    const vector_response = await vecDB_client.upsert(`${process.env.VEC_DB_NAME!}`, {
        wait: true,
        points: [
            {
                id: new_use_case.id,
                vector: embeddings,
                payload: {
                    id: new_use_case.id,
                    use_case: new_use_case.use_case,
                    category: new_use_case.category
                }
            }
        ]
    });

    return res.json({
        status: 200,
        msg: 'New use-case added to RLAE-DB.',
        payload: {
            id: new_use_case.id,
            category: new_use_case.category,
            use_case: new_use_case.use_case,
            qualities: new_use_case.qualities,
            outliers: new_use_case.outliers,
            specs: new_use_case.specs,
            conv_rate: new_use_case.conv_rate,
        },
        vector_db: vector_response
    });
});

export default router;