import { SarvamAI, SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv';

dotenv.config();
const client = new SarvamAIClient({apiSubscriptionKey:`${process.env.SARVAM_API_KEY}`});

export async function callSarvam(PROMPT: string) {
    const response = await client.chat.completions({
        messages: [
            {
                role: "user",
                content: PROMPT
            },
        ],
    });

    const final_response = JSON.parse(response.choices[0]?.message.content!);
    return final_response;
}