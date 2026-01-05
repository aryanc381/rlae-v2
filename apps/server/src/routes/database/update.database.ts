import express, { Router } from 'express';
import zod from 'zod';
import { prisma } from '../../lib/prisma.js';

const router: Router = express.Router();

const updateObj = zod.object({
    existing_variant_id: zod.number(),
    qualities: zod.array(zod.string()),
    outliers: zod.array(zod.string()),
    specs: zod.array(zod.string()),
    conv_rate: zod.number(),
    rfc: zod.string()
});

router.post('/update-kb', async(req, res) => {
    const parsed = updateObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }

    const { existing_variant_id, qualities, outliers, specs, conv_rate, rfc } = parsed.data;
    const existing_user = await prisma.kB_MAIN.findFirst({
        where: { id: existing_variant_id }
    });

    if(!existing_user) {
        return res.json({
            status: 404,
            msg: 'KB-Variant not found.'
        });
    }

    const archive_use_case = await prisma.kB_ARCHIVE.create({
        data: {
            parent_id: existing_variant_id,
            use_case: existing_user.use_case,
            qualities: existing_user.qualities,
            outliers: existing_user.outliers,
            specs: existing_user.specs,
            conv_rate: existing_user?.conv_rate
        }
    });

    const update_main_use_case = await prisma.kB_MAIN.update({
        where: { id: existing_user.id },
        data: {
            qualities: qualities,
            outliers: outliers,
            specs: specs,
            RFC: rfc,
            conv_rate: conv_rate
        }
    });

    return res.json({
        status: 200,
        msg: 'RLAE-DB for [USE-CASE] has been updated.',
        archived_use_case: {
            id: archive_use_case.id,
            parent_id: archive_use_case.parent_id,
            qualities: archive_use_case.qualities,
            outliers: archive_use_case.outliers,
            specs: archive_use_case.specs,
            conv_rate: archive_use_case.conv_rate
        },
        updated_main_use_case: {
            id: update_main_use_case.id,
            qualities: update_main_use_case.qualities,
            outliers: update_main_use_case.outliers,
            specs: update_main_use_case.specs,
            conv_rate: update_main_use_case.conv_rate
        }
    })
});

export default router;