import express, { Router } from 'express';
import zod from 'zod';
import dotenv from 'dotenv';
import { VapiClient } from "@vapi-ai/server-sdk";

dotenv.config();

const router: Router = express.Router();

const inputObj = zod.object({
    prompt: zod.string()
});

const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });

router.post("/call", async (req, res) => {
  try {
    const parsed = inputObj.safeParse(req.body);
    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({ path: err.path[0], msg: err.message }));
        return res.json({
            status: 403,
            msg: 'Invalid /create body.',
            error: formattedErrors
        });
    }

    const { prompt } = parsed.data;
    
    const assistant = await vapi.assistants.create({
        name: "Debt Collection Assistant",
        firstMessage: "Hey, I've called regarding the debt you've taken from Riverline AI, do you have five mins?",
        model: {
            provider: "openai",
            model: "gpt-4o",
            messages: [{ role: "system", content: prompt }]
        },
        voice: { provider: '11labs', voiceId: 'bIHbv24MWmeRgasZH58o' },
    });
    console.log("ASSISTANT-ID: " + assistant.id);

    const call = await vapi.calls.create({
        assistantId: assistant.id,
        phoneNumberId: '510addb8-b00c-4e52-a309-5c1b9290c3b7',
        customer: { number: '+919049122622' },
    });
    //@ts-ignore
    console.log("CALL-ID: " + call.id);

    return res.json({
        status: 200,
        msg: 'Call Queued...',
        //@ts-ignore
        call_id: call.id,
        assistant_id: assistant.id
    });
    } catch(err) {
        return res.json({
            status: 500,
            msg: 'Internal Server Error.'
        });
    } 
});

export default router;