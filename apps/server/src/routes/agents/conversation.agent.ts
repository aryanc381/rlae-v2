import express, { Router } from 'express';
import zod from 'zod';
import dotenv from 'dotenv';
import { VapiClient } from "@vapi-ai/server-sdk";

dotenv.config();

const router: Router = express.Router();

const inputObj = zod.object({
    prompt: zod.string(),
    phone: zod.string()
});

export const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });

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

    const { prompt, phone } = parsed.data;
    console.log('Prompt: ' + prompt);
    
    const assistant = await vapi.assistants.create({
        name: "Debt Collection Assistant",
        firstMessage: "Hello, I’m calling from Aryan Bank regarding an outstanding balance on your account. Do you have a few minutes to speak right now?",
        model: {
            provider: "openai",
            model: "gpt-4o",
            messages: [{ role: "system", content: prompt }]
        },
        voice: { provider: '11labs', voiceId: 'wlmwDR77ptH6bKHZui0l' },
    });
    console.log("ASSISTANT-ID: " + assistant.id);

    const call = await vapi.calls.create({
        assistantId: assistant.id,
        assistant: {
            "name": "Debt Collection Agent",
            "credentialIds": [assistant.id],
            model: {
                provider: "openai",
                model: "gpt-4o",
                messages: [{ role: "system", content: prompt }]
            },
            firstMessage: "Hello, I’m calling from Aryan Bank regarding an outstanding balance on your account. Do you have a few minutes to speak right now?",
            artifactPlan: {
                transcriptPlan: {
                enabled: true,
                assistantName: "bot",
                userName: "user"
                },
            },
        },
        phoneNumberId: '510addb8-b00c-4e52-a309-5c1b9290c3b7',
        customer: { number: phone },
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
        });
    } 
});

export default router;