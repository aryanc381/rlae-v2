import axios from 'axios';
import express, { Router } from 'express';
import zod from 'zod';

const router: Router = express.Router();

const inputObj = zod.object({
    prompt: zod.string(),
    phone: zod.string()
});

router.post('/pre-evaluation', async(req, res) => {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }
    const { prompt, phone } = parsed.data;
    const call_user = await axios.post('http://localhost:5000/v2/api/agents/call', { prompt: prompt, phone: phone });
    const assistant_id = call_user.data.assistant_id;
    const call_id = call_user.data.call_id;

    setTimeout(async () => {
        try {
        
        const logs_response = await axios.post(
            'http://localhost:5000/v2/api/database/collect-logs',
            { call_id }
        );
        const conversation_logs = logs_response.data.logs;
        console.log('# Collected logs #', conversation_logs);

        const metric_eval_response = await axios.post('http://localhost:5000/v2/api/agents/metric-evaluator', { prompt: prompt, conversation_logs: conversation_logs });
        const metrics = { compliance: metric_eval_response.data.compliance,  conv_success: metric_eval_response.data.conv_success, goal_completion: metric_eval_response.data.goal_completion, conv_rate: metric_eval_response.data.conv_rate };
        console.log("The metrics are: " + metrics);

        return res.json({
            status: 200,
            msg: 'Preprocessing workflow completed!',
            metrics: metrics,
            prompt: prompt
        });

        } catch (err) {
        console.error('Failed to collect logs:', err);
        }
    }, 60000);
});

export default router;