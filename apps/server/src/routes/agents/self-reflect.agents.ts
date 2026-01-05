import express, { Router } from 'express';
import zod from 'zod';
import { prisma } from '../../lib/prisma.js';
import { selfCorrectionPromptGenerator } from '../../prompts/self-correction-prompt.js';
import { callSarvam } from '../../llm/sarvam.llm.js';
import axios from 'axios';
import { useCaseAnalysisPromptGenerator } from '../../prompts/use-case-creation-prompt.js';

const router: Router = express.Router(); 

const inputObj = zod.object({
    conversation: zod.array(zod.object({role: zod.string(), payload: zod.string()})),
    use_case_id: zod.number().optional(),
    conv_rate: zod.number().min(0).max(1),
});

router.post('/self-reflection', async (req, res) => {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }

    const { conversation, use_case_id, conv_rate } = parsed.data;

    if(use_case_id) {
        const existing = await prisma.kB_MAIN.findFirst({
            where: { id: use_case_id }, select: { conv_rate: true, qualities: true, outliers: true, specs: true, RFC: true }
        });
        if (!existing) {
            return res.status(404).json({
                status: 404,
                msg: 'Use case not found'
            });
        }

        if(conv_rate >= 0.5) {
            return res.json({
                status: 200,
                msg: 'Successfull conversation and conversion rate, retaining agent-version ' + use_case_id,        
            });
        } else if(conv_rate < 0.50) {
            const prompt: string = await selfCorrectionPromptGenerator(conversation, existing);
            const response = await callSarvam(prompt);
            const { qualities, specs, outliers, rfc } = response;
            const evolve = await axios.post('http://localhost:5000/v2/api/database/update-kb', {
                existing_variant_id: use_case_id,
                qualities: qualities,
                outliers: outliers,
                specs: specs,
                rfc: rfc,
                conv_rate: conv_rate
            });
            
            return res.json({
                status: 200,
                msg: 'Self-Reflection has been performed.',
                action: {
                    evolution: evolve.data
                }
            });
        }
    } else {
        const prompt = await useCaseAnalysisPromptGenerator(conversation);
        const create = await callSarvam(prompt);
        const { category, use_case, qualities, specs, outliers } = create;
        const generate = await axios.post('http://localhost:5000/v2/api/database/create-new-kb', {
            category: category,
            use_case: use_case,
            qualities: qualities,
            outliers: outliers,
            specs: specs,
            conv_rate: conv_rate
        });
        return res.json({
            status: 200, 
            msg: 'Use-case created by Conversation Analysis.',
            action: {
                creation: generate.data
            }
        });
    }
});

export default router;