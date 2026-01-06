import express, { Router } from 'express';
import zod from 'zod';
// import { vapi } from '../agents/conversation.agent.js';

type ChatMessage = {
  role: "user" | "bot";
  message: string;
};

const conversations: ChatMessage[] = [];

const router: Router = express.Router();

const inputObj = zod.object({
    call_id: zod.string()
});

router.post('/collect-logs', async(req, res) => {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }

    const { call_id } = parsed.data;
    // const call = await vapi.calls.get({id: `${call_id}`});
    
    //@ts-ignore
    const conversation = call.artifact?.messages?.filter(log => log.role === "user" || log.role === "bot").map(log => ({ role: log.role, message: log.message }))
    console.log(conversation);

    return res.json({
        status: 200,
        msg: `Call logs for ID-[${call_id}]`,
        logs: conversation
    });
});

export default router;