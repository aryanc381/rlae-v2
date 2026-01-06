import express, { Router } from 'express';
import zod from 'zod';
import { metricEvaluatorPrompt } from '../../prompts/metric-evaluator-prompt.js';
import { callSarvam } from '../../llm/sarvam.llm.js';

const router: Router = express.Router();
const inputObj = zod.object({
    context: zod.string(),
    conversation_logs: zod.array(zod.object({ role: zod.string(), message: zod.string()}))
});

router.post('/metric-evaluator', async (req, res) => {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }
    const { context, conversation_logs } = parsed.data;

    const prompt = await metricEvaluatorPrompt(context, conversation_logs);

    const response = await callSarvam(prompt);
    const { conv_success, goal_completion, compliance, conv_rate } = response;

    return res.json({
        status: 200,
        msg: 'Evaluation Complete.',
        conv_success: conv_success,
        goal_completion: goal_completion,
        compliance: compliance,
        conv_rate: conv_rate
    });
});

export default router;